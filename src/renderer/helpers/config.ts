export type Config = {
  root: string;
  kichain: {
    nodeUrl: string;
    priceUrl: string;
    token: string;
    prefix: string;
    denom: string;
    udenom: string;
    network: {
      network: string;
      blockchain: string;
      chainId: string;
    };
  };
  domain: string;
  explorer: string;
};

export default {
  root: process.env.NODE_ENV === 'production' ? '/web' : '',
  kichain: {
    nodeUrl: import.meta.env.VITE_KICHAIN_NODE_URL,
    priceUrl: import.meta.env.VITE_KICHAIN_PRICE_URL,
    token: import.meta.env.VITE_KICHAIN_TOKEN,
    prefix: import.meta.env.VITE_KICHAIN_PREFIX,
    denom: import.meta.env.VITE_KICHAIN_DENOM,
    udenom: import.meta.env.VITE_KICHAIN_UDENOM,
    network: {
      network: import.meta.env.VITE_KICHAIN_NETWORK,
      blockchain: import.meta.env.VITE_KICHAIN_NETWORK_BLOCKCHAIN,
      chainId: import.meta.env.VITE_KICHAIN_NETWORK_CHAIN_ID,
    },
  },
  domain: import.meta.env.VITE_DOMAIN_URL,
  explorer: import.meta.env.VITE_EXPLORER_URL,
} as Config;
