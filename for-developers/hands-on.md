# Symbol Blockchain Hands-on for Developers

- If you can do the following operations, the content for developers is recommended.
  - Clone repository.
  - Execute node command.
  - Execute npm command.
  - Write code with Text Editor for programming. ex. VSCode, IntelliJ IDEA, etc
- If not, please refer the content for non developers. (Sorry, this content will be added later.)

## Goal of this hands-on

- Create an testnet account with Symbol Desktop Wallet.
- Get testnet XYM token from faucet.
- Send XYM token to another account with Symbol Desktop Wallet.
- Get account info from testnet node with programs you write yourself.
- Send XYM token to another account with programs you write yourself.

## Bookmarks

- Symbol Blockchain: [https://symbol-community.com/](https://symbol-community.com/)
- Symbol Desktop Wallet: [https://github.com/symbol/desktop-wallet/releases](https://github.com/symbol/desktop-wallet/releases)
- Testnet Block Explorer: [https://testnet.symbol.fyi](https://testnet.symbol.fyi)
- Testnet Node List: [https://symbolnodes.org/nodes_testnet/](https://symbolnodes.org/nodes_testnet/)

## Setup Environment

- Requirements
  - Node.js
  - npm

Clone hands-on repository and install npm packages.

```bash
git clone https://github.com/nemtus/webx-side-event-20230724.git
cd webx-side-event-20230724
npm i

```

If you have intereseted in setup details, please expand the following section.

<details>

- Setup Node.js & npm
- Install npm packages
  - devDependencies
    - typescript
    - ts-node
  - dependencies
    - symbol-sdk@2
    - rxjs
    - dotenv

### Setup Node.js & npm

- Volta [https://docs.volta.sh/guide/getting-started](https://docs.volta.sh/guide/getting-started)
- nvm [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

### Install npm packages

Install devDependencies.

- typescript
- ts-node

```bash
npm i -D typescript ts-node

```

Install dependencies.

- symbol-sdk@2 ... v3 is simple but not easy. I recommend v2 for beginners.
- rxjs ... symbol-sdk@2 depends on rxjs.
- dotenv ... handle private key as environment variables here.

```bash
npm i symbol-sdk@2 rxjs dotenv

```

</details>

## Setup Symbol Desktop Wallet

1. Download Symbol Desktop Wallet from [https://github.com/symbol/desktop-wallet/releases](https://github.com/symbol/desktop-wallet/releases) .
2. Install Symbol Desktop Wallet. You will get a warning about an unsigned program during installation, but please proceed as is.
3. Create a *testnet* wallet profile.
4. Open the faucet page and claim testnet XYM token.
5. Check your wallet balances.
6. Settings ... Default max Fee = Average

## Send XYM token and self introduce message to instructor's address with Symbol Desktop Wallet

Caution: This message will be published on the blockchain, so please make sure that your introductory message is not a problem to be published.

1. Click Home.
2. Click Send.
3. Input instructor's address ( TCLEIFA7GVMEE7TRM6IHHYQAIHCJAEF7D7HMVOI ) into `To:` field.
4. Input 10 into `Mosaic:` field.
5. Input your self introduction message into `Message` field.
6. Click Send button.
7. Check Tx preview and if it is OK, input password and click Confirm button.

## Copy the private key and add `.env` file

1. Copy `.env-example` file and rename it `.env` in the root directory of this repository.
2. On desktop wallet, click Accounts.
3. Click show and input password to show private key and click the copy button to copy private key.
4. Put your private key into `.env` file.
5. Click the copy button to copy address.
6. Put your address into `.env` file.

## Chose a node from testnet node list

1. It's a good idea to choose one with the https flag.
2. Copy the node url and add it to `.env` file.

## Get account info from testnet node with programs you write yourself

```bash
npx ts-node for-developers/1_get-account-info.ts

```

## Send transfer tx with programs you write yourself

```bash
npx ts-node for-developers/2_send-transfer-tx.ts

```
