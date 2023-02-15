# Ki Desktop Wallet

This repository hosts `ki-desktop-wallet`, a desktop wallet for the KiChain. This wallet is still in beta stage.

## Functionalities

The wallet allows:

-   Importing and creating KiChain accounts (addresses).
-   Maintaining multiple accounts.
-   Issuing transfer transactions: send.
-   Issuing staking transactions: delegate/undelegate/redelegate.
-   Issuing distribution transactions: withdraw rewards and/or commissions.
-   Viewing transactions (mini-explorer)
-   Generate, sign and broadcast transaction files
-   Perform the multi signature workflow (Generate, sign, collect, multisign)

## How to run The  Ki desktop Wallet
To run the Ki desktop wallet you need first to build it and then to run it or package it in electron.

### Run the wallet locally
Start by cloning this repository. Stable code will be always available on master:
```bash
git clone https://github.com/KiFoundation/ki-desktop-wallet.git
```

```bash
yarn install
```

```bash 
yarn dev
```

### Build and package the wallet
You can build and package the wallet for various operating systems using the follwing commands.

```bash
# Package the app for macOS
yarn build:mac

# Package the app for Windows
yarn build:win

# Package the app for Debian distributions
yarn build:linux
```

Or you can build for all operating systems using the following command:
```bash 
yarn build:all
```

Note: The wallet can also be built for testnet by using the following command:
```bash
yarn build:[OS]:preprod
```

## Security

If you discover a security vulnerability in this project, please report it to security@foundation.ki. We will promptly address all security vulnerabilities.

**Disclaimer**
The Ki desktop Wallet uses code parts from the [math-cosmos-web-wallet](https://github.com/mathwallet/math-cosmos-web-wallet) project by [MathWallet](https://github.com/mathwallet).
