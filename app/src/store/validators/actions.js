import { services } from '@services/index';
import { SET_VALIDATORS_LIST } from './mutations';

export const FETCH_VALIDATORS_LIST = 'FETCH_VALIDATORS_LIST';

export const actions = {
  [FETCH_VALIDATORS_LIST]: async ({ commit, state, getters, dispatch }) => {
    const responseValidators = await services.validator.fetchValidatorsList();
    commit(SET_VALIDATORS_LIST, responseValidators.data.result);
  },
};
