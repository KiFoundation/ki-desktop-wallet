import { services } from '@services/index';
import { SET_ACCOUNT } from './mutations';

export const HYDRATE_ACCOUNT = 'HYDRATE_ACCOUNT';

export const actions = {
  [HYDRATE_ACCOUNT]: async (
    { commit, state, getters, dispatch },
    accountId,
  ) => {
    // Start to fetch data
    const response = await services.auth.fetchAccount(accountId);
    if (response.data.result) {
      commit(SET_ACCOUNT, response.data.result);
    }
  },
};
