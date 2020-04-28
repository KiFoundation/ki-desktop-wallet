// Mutation Types definition
export const SET_ACCOUNT = `SET_ACCOUNT`;

// Mutations
export const mutations = {
  // Account state
  [SET_ACCOUNT](state, payload) {
    const s = { ...state.account, ...payload };
    state.account.id = s.id;
    state.account.name = s.name;
    state.account.type = s.type;
    state.account.value = s.value;
  },
};
