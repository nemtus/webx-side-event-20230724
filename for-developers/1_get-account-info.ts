import { firstValueFrom } from "rxjs";
import { RepositoryFactoryHttp, Address } from "symbol-sdk";
import dotenv from "dotenv";

dotenv.config();

const nodeUrl = process.env.NODE_URL!;
const repositoryFactoryHttp = new RepositoryFactoryHttp(nodeUrl);
const accountRepository = repositoryFactoryHttp.createAccountRepository();
const rawAddress = process.env.SYMBOL_TESTNET_ADDRESS!;
const address = Address.createFromRawAddress(rawAddress);

// RxJS
accountRepository.getAccountInfo(address).subscribe((accountInfo) => {
  console.dir({ accountInfo }, { depth: null });
  const mosaicIdHex = accountInfo.mosaics[0].id.toHex();
  const mosaicAmount = accountInfo.mosaics[0].amount.toString();
  console.log({
    mosaicIdHex,
    mosaicAmount,
  });
});

// Async/Await
(async () => {
  const accountInfo = await firstValueFrom(
    accountRepository.getAccountInfo(address)
  );
  console.dir({ accountInfo }, { depth: null });
  const mosaicIdHex = accountInfo.mosaics[0].id.toHex();
  const mosaicAmount = accountInfo.mosaics[0].amount.toString();
  console.log({
    mosaicIdHex,
    mosaicAmount,
  });
})();