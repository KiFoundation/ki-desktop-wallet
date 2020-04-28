export const SET_CURRENT_WALLET = 'SET_CURRENT_WALLET';
export const SET_CURRENT_WALLET_BALANCES = 'SET_CURRENT_WALLET_BALANCES';
export const SET_CURRENT_WALLET_TX = 'SET_CURRENT_WALLET_TX';
//
export const SET_WALLETS_LIST = 'SET_WALLETS_LIST';

export const mutations = {
  [SET_CURRENT_WALLET](state, wallet) {
    state.current = wallet;
  },
  [SET_CURRENT_WALLET_BALANCES](state, balances) {
    state.current = {
      ...state.current,
      balances,
    };
  },
  [SET_WALLETS_LIST](state, walletsList) {
    state.list = walletsList;
  },
};
