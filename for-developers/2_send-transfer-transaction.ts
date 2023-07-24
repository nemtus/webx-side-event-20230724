import { firstValueFrom } from "rxjs";
import {
  Account,
  Address,
  Deadline,
  Mosaic,
  PlainMessage,
  RepositoryFactoryHttp,
  TransferTransaction,
  UInt64,
} from "symbol-sdk";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const nodeUrl = process.env.NODE_URL!;
  const repositoryFactoryHttp = new RepositoryFactoryHttp(nodeUrl);

  // Get network info
  const networkType = await firstValueFrom(
    repositoryFactoryHttp.getNetworkType()
  );
  const epochAdjustment = await firstValueFrom(
    repositoryFactoryHttp.getEpochAdjustment()
  );
  const generationHash = await firstValueFrom(
    repositoryFactoryHttp.getGenerationHash()
  );
  const networkCurrencies = await firstValueFrom(
    repositoryFactoryHttp.getCurrencies()
  );
  const networkCurrency = networkCurrencies.currency;
  const networkCurrencyMosaicId = networkCurrency.mosaicId!;
  const networkCurrencyDivisibility = networkCurrency.divisibility;
  console.log({
    networkType,
    epochAdjustment,
    generationHash,
    networkCurrencyMosaicId,
    networkCurrencyDivisibility,
  });
  console.log(networkCurrencyMosaicId.toHex());

  // Sender account info
  const senderRawPrivateKey = process.env.SYMBOL_TESTNET_PRIVATE_KEY!;
  const senderRawAddress = process.env.SYMBOL_TESTNET_ADDRESS!;
  const senderAccount = Account.createFromPrivateKey(
    senderRawPrivateKey,
    networkType
  );
  if (senderAccount.address.plain() !== senderRawAddress) {
    throw Error("senderAccount does not match senderRawAddress");
  }

  // Transaction info
  const deadline = Deadline.create(epochAdjustment); // 2 hours by default. max 6 hours.
  const recipientRawAddress = "TCLEIFA7GVMEE7TRM6IHHYQAIHCJAEF7D7HMVOI";
  const recipientAddress = Address.createFromRawAddress(recipientRawAddress);
  const relativeAmount = 10; // 10[XYM] = 10*10^divisibility[microXYM], XYM token's divisibility = 6
  const absoluteAmount =
    relativeAmount * parseInt("1" + "0".repeat(networkCurrencyDivisibility)); // networkCurrencyDivisibility = 6 => 1[XYM] = 10^6[μXYM]
  const absoluteAmountUInt64 = UInt64.fromUint(absoluteAmount);
  const mosaic = new Mosaic(networkCurrencyMosaicId, absoluteAmountUInt64);
  const mosaics = [mosaic];
  const rawMessage = "I'm Yasunori Matsuoka ( https://twitter.com/salaryman_tousi ) belongs non-profit organization called NEMTUS ( https://nemtus.com/ , https://twitter.com/NemtusOfficial ) to promote blockchain technology especially NEM and Symbol blockchain. Tody, I am so happy to meet you on this event. ( https://lu.ma/jnidr8rv ) I hope you enjoy the experience to touch Symbol blockchain. Let's send your introductory message to this address. But be careful it will be public and you can't delete it.";
  const plainMessage = PlainMessage.create(rawMessage); // Plain message. Max 1024 bytes.
  const feeMultiplier = 100; // Affects transaction fees. At present, the default node has a fee multiplier of 100, and many nodes specify a lower number, which tends to result in quicker approval if 100 is specified.

  // Create transaction
  const transferTransaction = TransferTransaction.create(
    deadline,
    recipientAddress,
    mosaics,
    plainMessage,
    networkType
  ).setMaxFee(feeMultiplier);

  // Sign transaction
  const signedTransaction = senderAccount.sign(
    transferTransaction,
    generationHash
  );

  // Start monitoring of transaction status with websocket
  const listener = repositoryFactoryHttp.createListener();
  await listener.open();
  listener.newBlock().subscribe((block) => {
    console.log("New blok");
    console.dir({ block }, { depth: null });
  });
  listener.status(senderAccount.address).subscribe((status) => {
    console.dir({ status }, { depth: null });
    listener.close();
    console.log("Transaction status error");
  });
  listener
    .unconfirmedAdded(senderAccount.address)
    .subscribe((unconfirmedTransaction) => {
      console.dir({ unconfirmedTransaction }, { depth: null });
      console.log("Transaction unconfirmed");
    });
  listener
    .confirmed(senderAccount.address)
    .subscribe((confirmedTransaction) => {
      console.dir({ confirmedTransaction }, { depth: null });
      listener.close();
      console.log("Transaction confirmed");
      console.log(
        `https://testnet.symbol.fyi/transactions/${confirmedTransaction.transactionInfo?.hash}`
      );
    });

  // Announce transaction
  const transactionRepository =
    repositoryFactoryHttp.createTransactionRepository();
  const transactionAnnounceResponse = await firstValueFrom(
    transactionRepository.announce(signedTransaction)
  );
  console.dir({ transactionAnnounceResponse }, { depth: null });
})();
