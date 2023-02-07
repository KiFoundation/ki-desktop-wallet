import numeral from 'numeral';

export const tokenUtil = {
  format: (tokens: number) => numeral(tokens / Math.pow(10, 6)).format('0,0.00[0000]'),
  formatShort: (tokens: number) => numeral(tokens / Math.pow(10, 6)).format('0,0.00'),
  formatPrice: (price: number) => numeral(price).format('0,0.000'),
};

export const availableTokens = [
  { name: import.meta.env.VITE_KICHAIN_DENOM.toUpperCase(), denom: import.meta.env.VITE_KICHAIN_UDENOM },
  { name: import.meta.env.VITE_USDC_TOKEN.toUpperCase(), denom: import.meta.env.VITE_USDC_DENOM },
];

export const getTokenNameByDenom = (denom: string) => {
  if (new RegExp(denom).test(import.meta.env.VITE_USDC_DENOM)) {
    return import.meta.env.VITE_USDC_TOKEN;
  }
  return import.meta.env.VITE_KICHAIN_TOKEN;
};
