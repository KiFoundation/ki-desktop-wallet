export const INIT_TX = 'INIT_TX';
export const TX_SUCCESS = 'TX_SUCCESS';
export const TX_ERROR = 'TX_ERROR';

export const mutations = {
  [INIT_TX](state) {
    state.tx.loading = true;
  },
  [TX_SUCCESS](state, tx) {
    (state.tx.loading = false), (state.tx.result = tx), (state.tx.error = null);
  },
  [TX_ERROR](state, error) {
    (state.tx.loading = false), (state.tx.result = null), (state.tx.error = error);
  },
};
