import { services } from '@services/index';
import { priceservices } from '@services/price-api/index';
import { SET_ACCOUNT, SET_PRICE} from './mutations';

export const HYDRATE_ACCOUNT = 'HYDRATE_ACCOUNT';
export const GET_PRICE = 'GET_PRICE';

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
  [GET_PRICE]: async (
    { commit, state, getters, dispatch },
  ) => {
    // Start to fetch data
    const response = await priceservices.price.fetchPrice();
    if (response.data.result) {
      commit(SET_PRICE, response.data.result);
    }
  },
};
