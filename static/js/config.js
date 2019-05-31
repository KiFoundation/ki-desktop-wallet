export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  cosmos: {
    nodeUrl: "https://cosmos.medishares.net",
    token: "ATOM",
    network: {
      blockchain: 'cosmos',
      chainId: "cosmoshub-2"
    }
  },
  domain: 'http://localhost/'
}