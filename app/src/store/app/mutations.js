// Mutation Types definition
export const TOGGLE_NAV = 'TOGGLE_NAV';

// Mutations
export const mutations = {
  // Nav state
  [TOGGLE_NAV](state) {
    state.nav.toggle = !state.nav.toggle;
  },
};
