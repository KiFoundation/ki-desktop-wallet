// Mutation Types definition
export const SET_ACCOUNT = `SET_ACCOUNT`;
export const SET_PRICE = `SET_PRICE`;

// Mutations
export const mutations = {
  // Account state
  [SET_ACCOUNT](state, payload) {
    state.account = { ...state.account, ...payload };
  },
  [SET_PRICE](state, payload) {
    state.price =  payload ;
  },
};
