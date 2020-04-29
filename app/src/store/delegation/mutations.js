export const INIT_DELEGATE = 'INIT_DELEGATE';
export const DELEGATE_SUCCESS = 'DELEGATE_SUCCESS';
export const DELEGATE_ERROR = 'DELEGATE_ERROR';

export const mutations = {
  [INIT_DELEGATE](state) {
    state.delegation.loading = true;
  },
  [DELEGATE_SUCCESS](state, delegation) {
    (state.delegation.loading = false),
      (state.delegation.result = delegation),
      (state.delegation.error = null);
  },
  [DELEGATE_ERROR](state, error) {
    (state.delegation.loading = false),
      (state.delegation.result = null),
      (state.delegation.error = error);
  },
};
