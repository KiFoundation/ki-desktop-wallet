import { mutations } from './mutations';
import { actions } from './actions';
export * from './mutations';
export * from './actions';

export const moduleAccount = {
  state: {
    name: null,
    id: null,
    type: null,
    value: null,
  },
  mutations,
  actions,
};
