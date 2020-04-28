import * as numeral from 'numeral';

export const GET_CURRENT_WALLET_BALANCES_AMOUNT =
  'GET_CURRENT_WALLET_BALANCES_AMOUNT';
export const GET_CURRENT_WALLET_BALANCES_DENOM =
  'GET_CURRENT_WALLET_BALANCES_DENOM';

export const getters = {
  [GET_CURRENT_WALLET_BALANCES_AMOUNT]: (state, getters) => {
    if (state.wallets.current && state.wallets.current.balances) {
      const balancesAmount = state.wallets.current.balances.reduce((a, b) => {
        return a + b.amount;
      }, 0);
      return numeral(balancesAmount / Math.pow(10, 6)).format('0,0.000000');
    }
    return '';
  },
  [GET_CURRENT_WALLET_BALANCES_DENOM]: (state, getters) => {
    if (state.wallets.current && state.wallets.current.balances) {
      return (
        (state.wallets.current.balances[0] &&
          state.wallets.current.balances[0].denom) ||
        ''
      );
    }
    return '';
  },
};
