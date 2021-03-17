export const SET_VALIDATORS_LIST = 'SET_VALIDATORS_LIST';
export const SET_VALIDATORS_DICT = 'SET_VALIDATORS_DICT';

export const mutations = {
  [SET_VALIDATORS_LIST](state, validatorsList) {
    state.validators.list = validatorsList;
  },
  [SET_VALIDATORS_DICT](state, validatorsDict) {
    state.validators.dict = validatorsDict;
  },
};
