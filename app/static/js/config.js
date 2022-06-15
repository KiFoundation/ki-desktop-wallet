export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  kichain: {
    nodeUrl: "https://api-wallet.blockchain.ki",
    priceUrl: "https://oracle.blockchain.ki",
    token: 'ҟ',
    prefix: 'ki',
    denom: 'xki',
    udenom: 'uxki',
    network: {
      network: 'Mainnet',
      blockchain: 'cosmos',
      chainId: 'kichain-2',
    },
  },
  domain: 'http://localhost/',
  explorer: 'https://blockchain.ki/'
};