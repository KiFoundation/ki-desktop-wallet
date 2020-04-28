import { mutations } from './mutations';
import { actions } from './actions';

export * from './mutations';
export * from './actions';

export const moduleValidators = {
  state: {
    current: null,
    lists: [],
  },
  mutations,
  actions,
};
