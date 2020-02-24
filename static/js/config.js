export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  kichain: {
    nodeUrl: "https://api-testnet.blockchain.ki",
    token: "tki",
    prefix: "tki",
    network: {
      blockchain: 'cosmos',
      chainId: "KiChain-t"
    }
  },
  domain: 'http://localhost/',
  explorer: 'https://blockchain.ki/'
}
