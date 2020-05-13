export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  kichain: {
    // nodeUrl: "https://api-devnet.blockchain.ki",
    nodeUrl: 'https://api-testnet.blockchain.ki',
    token: 'tҟ',
    prefix: 'tki',
    network: {
      // network: 'Devnet',
      network: 'Testnet',
      blockchain: 'cosmos',
      // chainId: "KiChain-t"
      chainId: 'KiChain-t-1',
    },
  },
  domain: 'http://localhost/',
  // explorer: 'https://devnet.blockchain.ki/'
  explorer: 'https://testnet.blockchain.ki/',
};
