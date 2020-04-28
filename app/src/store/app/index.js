import { mutations } from './mutations';
export * from './mutations';

export const moduleApp = {
  state: {
    nav: {
      toogle: false,
    },
  },
  mutations,
};
