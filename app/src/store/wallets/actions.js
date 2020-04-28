import { services } from '@services/';
import { SET_CURRENT_WALLET_BALANCES, SET_CURRENT_WALLET } from './mutations';

export const HYDRATE_CURRENT_WALLET = 'HYDRATE_CURRENT_WALLET';
export const FETCH_WALLET_BALANCES = 'FETCH_WALLET_BALANCES';

export const actions = {
  [HYDRATE_CURRENT_WALLET]: async (
    { commit, state, getters, dispatch },
    wallet,
  ) => {
    let walletTmp = (wallet && Object.assign({}, wallet)) || null;
    if (walletTmp) {
      // Save into local storage
      localStorage.setItem('current_wallet', JSON.stringify(walletTmp));
      // Start to fetch data
      const responseBalances = await services.wallet.fetchBalancesList(
        /* wallet.address */ 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3',
      );
      if (responseBalances.data.result) {
        walletTmp = {
          ...walletTmp,
          balances: responseBalances.data.result,
        };
      }
    } else {
      localStorage.removeItem('current_wallet');
    }
    commit(SET_CURRENT_WALLET, walletTmp);
  },
  [FETCH_WALLET_BALANCES]: async (
    { commit, state, getters, dispatch },
    walletId,
  ) => {
    const responseBalances = await services.wallet.fetchBalancesList(
      /* walletId */ 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3',
    );
    commit(SET_CURRENT_WALLET_BALANCES, responseBalances.data.result);
  },
};
