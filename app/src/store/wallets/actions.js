import { services } from '@services/index';
import {
  SET_CURRENT_WALLET_BALANCES,
  SET_CURRENT_WALLET,
  SET_CURRENT_WALLET_VALIDATORS,
  START_HYDRATE,
  END_HYDRATE,
} from './mutations';

export const HYDRATE_CURRENT_WALLET = 'HYDRATE_CURRENT_WALLET';
export const FETCH_WALLET_BALANCES = 'FETCH_WALLET_BALANCES';
export const FETCH_WALLET_VALIDATORS = 'FETCH_WALLET_VALIDATORS';

import util from '@static/js/util';

export const actions = {
  [HYDRATE_CURRENT_WALLET]: async (
    { commit, state, getters, dispatch, rootState },
    wallet,
  ) => {
    let walletTmp = (wallet && Object.assign({}, wallet)) || null;
    if (walletTmp) {
      commit(START_HYDRATE);
      // Start to fetch data
      const responseBalances = await services.wallet.fetchBalancesList(
        wallet.address,
      );
      const responseValidators = await services.wallet.fetchDelegatorsValidatorsList(
        wallet.address,
      );
      const responseDelegation = await services.wallet.fetchDelegatorsDelegationsList(
        wallet.address,
      );
      const responseUnbondingDelegation = await services.wallet.fetchDelegatorsUnbondingDelegationsList(
        wallet.address,
      );

      if (responseBalances.data.result) {
        walletTmp = {
          ...walletTmp,
          bgImageStyle: util.generateWalletGradient(wallet.address),
          balances: responseBalances.data.result,
          validators: responseValidators.data.result,
          delegation: responseDelegation.data.result,
          unbondingDelegation: responseUnbondingDelegation.data.result,
        };
      }
      commit(END_HYDRATE);
    } else {
      localStorage.removeItem('current_wallet');
    }
    commit(SET_CURRENT_WALLET, walletTmp);
  },
  [FETCH_WALLET_VALIDATORS]: async ({ commit, state, getters, dispatch }) => {
    const responseValidators = await services.wallet.fetchDelegatorsValidatorsList(
      state.wallets.current.address,
    );
    commit(
      SET_CURRENT_WALLET_VALIDATORS,
      (responseValidators.data && responseValidators.data.result) || [],
    );
  },
  [FETCH_WALLET_BALANCES]: async (
    { commit, state, getters, dispatch },
    walletId,
  ) => {
    const responseBalances = await services.wallet.fetchBalancesList(walletId);
    commit(SET_CURRENT_WALLET_BALANCES, responseBalances.data.result);
  },
};
