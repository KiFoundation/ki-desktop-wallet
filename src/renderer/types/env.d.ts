interface ImportMetaEnv {
  readonly VITE_IS_PRODUCTION: string;
  //
  readonly VITE_DOMAIN_URL: string;
  readonly VITE_EXPLORER_URL: string;
  //
  readonly VITE_KICHAIN_NODE_URL: string;
  readonly VITE_KICHAIN_PRICE_URL: string;
  readonly VITE_KICHAIN_TOKEN: string;
  readonly VITE_KICHAIN_PREFIX: string;
  readonly VITE_KICHAIN_DENOM: string;
  readonly VITE_KICHAIN_UDENOM: string;
  readonly VITE_KICHAIN_NETWORK: string;
  readonly VITE_KICHAIN_NETWORK_BLOCKCHAIN: string;
  readonly VITE_KICHAIN_NETWORK_CHAIN_ID: string;
  //
  readonly VITE_USDC_TOKEN: string;
  readonly VITE_USDC_DENOM: string;
  //
  readonly VITE_GAS_PRICE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
