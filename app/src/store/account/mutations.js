// Mutation Types definition
export const SET_ACCOUNT = `SET_ACCOUNT`;

// Mutations
export const mutations = {
  // Account state
  [SET_ACCOUNT](state, { name, id }) {
    state = {
      name,
      id,
    };
  },
};
