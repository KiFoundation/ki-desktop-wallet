import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export * from './mutations';
export * from './actions';
export * from './getters';

export const moduleWallets = {
  state: {
    current:
      (localStorage.getItem('current_wallet') &&
        JSON.parse(localStorage.getItem('current_wallet'))) ||
      null,
    list: [],
  },
  mutations,
  actions,
  getters,
};
