// Mutation Types definition
export const TOGGLE_NAV = 'TOGGLE_NAV';

// Mutations
export const mutations = {
  // Nav state
  [TOGGLE_NAV](state) {
    state.app.nav.toggle = !state.app.nav.toggle;
  },
};
