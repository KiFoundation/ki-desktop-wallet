import { mutations } from './mutations';
import { actions } from './actions';
import { getters } from './getters';

export * from './mutations';
export * from './actions';
export * from './getters';

export const moduleWallets = {
  state: {
    loading: false,
    current: null,
    list: [],
  },
  mutations,
  actions,
  getters,
};
