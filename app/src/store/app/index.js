import { mutations } from './mutations';
export * from './mutations';
import config from '@static/js/config';

export const moduleApp = {
  state: {
    nav: {
      toogle: false,
    },
    advanced: false,
    // multisign: false,
    chainId: config.kichain.network.chainId,
    denom: config.kichain.denom,
    udenom: config.kichain.udenom,
  },
  mutations,
};
