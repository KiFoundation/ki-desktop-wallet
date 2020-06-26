<p align="right">
    <img width=150px src="https://wallet-testnet.blockchain.ki/static/img/icons/ki-chain.png" />
</p>

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

### Build the wallet
Start by cloning this repository. Stable code will be always available on master:
```bash
git clone https://github.com/KiFoundation/ki-desktop-wallet.git
```

To build the wallet you can use the provided script as follows:
```bash
# Install dependencies and build the wallet
$(cd app/ ; npm install; sh build.sh)
```

_[Optional] If you want to test the wallet with out packaging it with electron, you can serve it in your browser with hot reload at localhost. It works as follows:_

```bash
npm run dev
```

### Run and package in electron
Now that the wallet app is built you can package it for the various operating systems.

```bash
# Install dependencies
npm install

# [Optional] to run the app in dev mode
npm start

# Package the app for macOS
npm run package-mac

# Package the app for Windows (On windows)
npm run package-win

# Package the app for Debian distributions
npm run package-linux
```

Packaging the wallet for Windows (i.e. generating a `.exe` file) needs to be done on a system running Windows. However, you can also package the app for all of the platforms from within macOS or Debian. Therefor, you need to install Wine:

1- Install Wine for mac
```bash
# Install XQuartz (Prerequisite)
brew cask install xquartz

# install wine
brew cask install --no-quarantine wine-stable
```

2- Install Wine for Debian (tested on distribution 10)
```bash
# Enable 32 bit architecture
sudo dpkg --add-architecture i386

# Add WineHQ repository
sudo apt update
sudo apt -y install gnupg2 software-properties-common
wget -qO - https://dl.winehq.org/wine-builds/winehq.key | sudo apt-key add -
sudo apt-add-repository https://dl.winehq.org/wine-builds/debian/

# Install Wine 5
wget -O- -q https://download.opensuse.org/repositories/Emulators:/Wine:/Debian/Debian_10/Release.key | sudo apt-key add -
echo "deb http://download.opensuse.org/repositories/Emulators:/Wine:/Debian/Debian_10 ./" | sudo tee /etc/apt/sources.list.d/wine-obs.list
sudo apt update
sudo apt install --install-recommends winehq-stable

```
More details about installing wine can be found [here](https://computingforgeeks.com/how-to-install-wine-on-debian/).

Now your whole procedure to build and package the wallet for all the platforms from within macOS (or Debian) will look like:

```bash
$(cd app/ ; npm install; sh build.sh)
npm install
npm run package-mac
npm run package-win
npm run package-linux
```

### Create installers
Packaging
#### Create installers separately
1 - Create Windows installer `.msi`:


2 - Create MacOS installer `.dmg`:

2 - Create Debian installer `.deb`:

#### Create all installers on MacOS [Not optimal]

## Security

If you discover a security vulnerability in this project, please report it to security@foundation.ki. We will promptly address all security vulnerabilities.

**Disclaimer**
The Ki desktop Wallet uses code parts from the [math-cosmos-web-wallet](https://github.com/mathwallet/math-cosmos-web-wallet) project by [MathWallet](https://github.com/mathwallet).
