import { mutations } from './mutations';
import { actions } from './actions';

export * from './mutations';
export * from './actions';

export const moduleTransfer = {
  state: {
    loading: false,
    error: null,
    result: null,
  },
  mutations,
  actions,
};
