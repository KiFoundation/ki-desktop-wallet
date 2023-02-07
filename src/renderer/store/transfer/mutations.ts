export const INIT_TRANSFER = 'INIT_TRANSFER';
export const TRANSFER_SUCCESS = 'TRANSFER_SUCCESS';
export const TRANSFER_ERROR = 'TRANSFER_ERROR';

export const mutations = {
  [INIT_TRANSFER](state) {
    state.transfer.loading = true;
  },
  [TRANSFER_SUCCESS](state, transfer) {
    (state.transfer.loading = false), (state.transfer.result = transfer), (state.transfer.error = null);
  },
  [TRANSFER_ERROR](state, error) {
    (state.transfer.loading = false), (state.transfer.result = null), (state.transfer.error = error);
  },
};
