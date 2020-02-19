export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  kichain: {
    nodeUrl: "http://localhost:8282",
    token: "tki",
    prefix: "cosmos",
    network: {
      blockchain: 'cosmos',
      chainId: "KiChain"
    }
  },
  domain: 'http://localhost/',
  explorer: 'http://blockchain-0.srv.kifoundation.tech/'
}
