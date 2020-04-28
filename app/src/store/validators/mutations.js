export const SET_VALIDATORS_LIST = 'SET_VALIDATORS_LIST';

export const mutations = {
  [SET_VALIDATORS_LIST](state, validatorsList) {
    state.validators.list = validatorsList;
  },
};
