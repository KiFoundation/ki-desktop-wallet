<p align="right">
    <img width=150px src="https://wallet-testnet.blockchain.ki/static/img/icons/ki-chain.png" />
</p>

# Ki Desktop Wallet

This repository hosts `ki-desktop-wallet`, a desktop wallet for the KiChain.

## Functionalities

The wallet allows:

-   Importing and creating KiChain accounts (addresses).
-   Maintaining multiple accounts.
-   Issuing transfer transactions: send.
-   Issuing staking transactions: delegate/undelegate/redelegate transactions.
-   Issuing distribution transactions: withdraw rewards and/or commissions.
-   Viewing send and delegation transactions (mini-explorer)
-   Generate, sign and broadcast transaction files
-   Perform the multi signature workflow (Generate, sign, collect, multisign)

## How to run The  Ki desktop Wallet

### Build the wallet

#### Install dependencies

```bash
cd /ki-desktop-wallet/app && npm install
```

#### Build for production with minification

```bash
./build.sh
```

You can also serve the app in your browser with hot reload at localhost

```bash
npm run dev
```

### Build electron

```bash
# Go into the parent repository and install dependencies
cd .. && npm install

# Run the app in dev mode
npm start

# Build the app for macOS
npm run package-mac
```

## Disclaimer

The Ki desktop Wallet is based on the [math-cosmos-web-wallet](https://github.com/mathwallet/math-cosmos-web-wallet) project by [MathWallet](https://github.com/mathwallet).

## Security

If you discover a security vulnerability in this project, please report it to security@foundation.ki. We will promptly address all security vulnerabilities.
