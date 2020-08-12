export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  kichain: {
    nodeUrl: "https://api-wallet.blockchain.ki",
    token: 'ҟ',
    prefix: 'ki',
    denom: 'xki',
    udenom: 'uxki',
    network: {
      network: 'Mainnet',
      blockchain: 'cosmos',
      chainId: 'kichain-1',
    },
  },
  domain: 'http://localhost/',
  explorer: 'https://blockchain.ki/'
};
