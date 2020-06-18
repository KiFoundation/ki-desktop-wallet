export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  kichain: {
    nodeUrl: "https://api-mainnet.blockchain.ki",
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
  explorer: 'https://mainnet.blockchain.ki/'
};
