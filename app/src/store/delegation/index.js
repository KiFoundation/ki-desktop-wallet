import { mutations } from './mutations';
import { actions } from './actions';
export * from './mutations';
export * from './actions';

export const moduleDelegation = {
  state: {
    result: null,
    loading: false,
    error: null,
  },
  mutations,
  actions,
};
