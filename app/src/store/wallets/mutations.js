export const SET_CURRENT_WALLET = 'SET_CURRENT_WALLET';
export const SET_CURRENT_WALLET_BALANCES = 'SET_CURRENT_WALLET_BALANCES';
export const SET_CURRENT_WALLET_VALIDATORS = 'SET_CURRENT_WALLET_VALIDATORS';
export const SET_CURRENT_WALLET_REWARDS = 'SET_CURRENT_WALLET_REWARDS';
export const SET_CURRENT_WALLET_TX = 'SET_CURRENT_WALLET_TX';

export const SET_WALLETS_LIST = 'SET_WALLETS_LIST';
export const SET_WALLETS_DICT = 'SET_WALLETS_DICT';
export const START_HYDRATE = 'START_HYDRATE';
export const END_HYDRATE = 'END_HYDRATE';

export const mutations = {
  [SET_CURRENT_WALLET](state, wallet) {
    state.wallets.current = wallet;
  },
  [SET_CURRENT_WALLET_BALANCES](state, balances) {
    state.wallets.current = {
      ...state.wallets.current,
      balances,
    };
  },
  [SET_CURRENT_WALLET_VALIDATORS](state, validators) {
    state.wallets.current = {
      ...state.wallets.current,
      validators,
    };
  },
  [SET_CURRENT_WALLET_REWARDS](state, rewards) {
    state.wallets.current = {
      ...state.wallets.current,
      rewards,
    };
  },
  
  [SET_WALLETS_LIST](state, walletsList) {
    state.wallets.list = walletsList;
  },
  [SET_WALLETS_DICT](state, walletsdict) {
    state.wallets.dict = walletsdict;
  },
  [START_HYDRATE](state) {
    state.wallets.loading = true;
  },
  [END_HYDRATE](state) {
    state.wallets.loading = false;
  },
};
