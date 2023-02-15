export const GET_CURRENT_WALLET_BALANCES_AMOUNT = 'GET_CURRENT_WALLET_BALANCES_AMOUNT';
export const GET_CURRENT_WALLET_BALANCES_DENOM = 'GET_CURRENT_WALLET_BALANCES_DENOM';

export const getters = {
  [GET_CURRENT_WALLET_BALANCES_AMOUNT]: (state, getters) => {
    return state.wallets.current.balances;
  },
  [GET_CURRENT_WALLET_BALANCES_DENOM]: (state, getters) => {
    return state.wallets.current.balances.denom;
  },
};
