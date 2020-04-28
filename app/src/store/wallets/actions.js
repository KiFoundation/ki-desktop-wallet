import { services } from '@services/index';
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
      walletTmp;

      // Save into local storage
      localStorage.setItem('current_wallet', JSON.stringify(walletTmp));
      // Start to fetch data
      const responseBalances = await services.wallet.fetchBalancesList(
        wallet.address /* 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3' */,
      );

      const responseValidators = await services.wallet.fetchDelegatorsValidatorsList(
        wallet.address /* 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3' */,
      );
      const responseDelegation = await services.wallet.fetchDelegatorsDelegationsList(
        wallet.address /* 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3' */,
      );
      const responseUnbondingDelegation = await services.wallet.fetchDelegatorsUnbondingDelegationsList(
        wallet.address /* 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3' */,
      );
      console.log('responseValidators :: ', responseValidators);
      console.log('responseDelegation :: ', responseDelegation);
      console.log(
        'responseUnbondingDelegation :: ',
        responseUnbondingDelegation,
      );
      if (responseBalances.data.result) {
        walletTmp = {
          ...walletTmp,
          balances: responseBalances.data.result,
          validators: responseValidators.data.result,
          delegation: responseDelegation.data.result,
          unbondingDelegation: responseUnbondingDelegation.data.result,
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
