import { mutations } from './mutations';
export * from './mutations';

export const moduleAccount = {
  state: {
    name: null,
    id: null,
  },
  mutations,
};
