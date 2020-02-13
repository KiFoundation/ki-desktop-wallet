export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  kichain: {
    nodeUrl: "http://localhost:8282",
    token: "tki",
    network: {
      blockchain: 'cosmos',
      chainId: "KiChain"
    }
  },
  domain: 'http://localhost/',
  explorer: 'http://localhost:3000/'
}
