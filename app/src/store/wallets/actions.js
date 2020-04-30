import { services } from '@services/index';
import {
  SET_CURRENT_WALLET_BALANCES,
  SET_CURRENT_WALLET,
  SET_CURRENT_WALLET_VALIDATORS,
} from './mutations';

export const HYDRATE_CURRENT_WALLET = 'HYDRATE_CURRENT_WALLET';
export const FETCH_WALLET_BALANCES = 'FETCH_WALLET_BALANCES';
export const FETCH_WALLET_VALIDATORS = 'FETCH_WALLET_VALIDATORS';

export const actions = {
  [HYDRATE_CURRENT_WALLET]: async (
    { commit, state, getters, dispatch, rootState },
    wallet,
  ) => {
    let walletTmp = (wallet && Object.assign({}, wallet)) || null;
    if (walletTmp) {
      // Save into local storage
      localStorage.setItem('current_wallet', JSON.stringify(walletTmp));
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
        wallet.address /* 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3' */,
      );

      // Fetch the sent transactions
      let transactions = []
      let transactionsRaw = []

      const responseWalletTransactionsSendPage = await services.tx.fetchTxsList(
        {"message.sender" : wallet.address, "message.action": "send" },
      );

      let pages = responseWalletTransactionsSendPage.data.page_total
      if (pages != 0){
          for (var page =1; page<=pages; page++ ){
            let responseWalletTransactionsSend = await services.tx.fetchTxsList(
              {"message.sender" : wallet.address, "message.action": "send", "page":page },
            );

            transactionsRaw = responseWalletTransactionsSend.data.txs

            for (var tx_key in transactionsRaw){

              var tx = transactionsRaw[tx_key]

              let fee = 0
              if (tx.tx.value.fee.amount.length > 0) {
                fee = tx.tx.value.fee.amount[0].amount / Math.pow(10, 6)
              }

              transactions.push([tx.txhash, 'send',
                tx.tx.value.msg[0].value.to_address,
                tx.tx.value.msg[0].value.amount[0].amount / Math.pow(10, 6),
                fee, tx.timestamp
              ])
            }
          }
        }

      // Fetch the recieved transactions
      const responseWalletTransactionsReceivePage = await services.tx.fetchTxsList(
        {"transfer.recipient" : wallet.address, "message.action": "send" }/* 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3' */,
      );

      pages = responseWalletTransactionsReceivePage.data.page_total
      if (pages != 0){
          for (var page = 1; page<=pages; page++ ){
            let responseWalletTransactionsReceive = await services.tx.fetchTxsList(
              {"transfer.recipient" : wallet.address, "message.action": "send" , "page":page },
            );

            transactionsRaw = responseWalletTransactionsReceive.data.txs

            for (var tx_key in transactionsRaw){

              var tx = transactionsRaw[tx_key]

              let fee = 0
              if (tx.tx.value.fee.amount.length > 0) {
                fee = tx.tx.value.fee.amount[0].amount / Math.pow(10, 6)
              }

              transactions.push([tx.txhash, 'receive',
                tx.tx.value.msg[0].value.to_address,
                tx.tx.value.msg[0].value.amount[0].amount / Math.pow(10, 6),
                fee, tx.timestamp
              ])
            }
          }
        }


        // Fetch the delegate transactions
      const responseWalletTransactionsDelegatePage = await services.tx.fetchTxsList(
        {"message.sender" : wallet.address, "message.action": "delegate" }/* 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3' */,
      );

      pages = responseWalletTransactionsDelegatePage.data.page_total
      if (pages != 0){
          for (var page = 1; page<=pages; page++ ){
            let responseWalletTransactionsDelegate = await services.tx.fetchTxsList(
              {"message.sender" : wallet.address, "message.action": "delegate" , "page":page },
            );

            transactionsRaw = responseWalletTransactionsDelegate.data.txs

            for (var tx_key in transactionsRaw){
              var tx = transactionsRaw[tx_key]

              let fee = 0

              if (tx.tx.value.fee.amount.length > 0) {
                fee = tx.tx.value.fee.amount[0].amount / Math.pow(10, 6)
              }

              transactions.push([tx.txhash, 'delegate',
                tx.tx.value.msg[0].value.validator_address,
                tx.tx.value.msg[0].value.amount.amount / Math.pow(10, 6),
                fee, tx.timestamp
              ])
            }
          }
        }
      transactions.sort(function(a, b) {
        const date_a = Date.parse(a[5])
        const date_b = Date.parse(b[5])

        let comparison = 0;
        if (date_a > date_b) {
          comparison = 1;
        } else if (date_a < date_b) {
          comparison = -1;
        }
        return comparison * -1;
      })

      if (responseBalances.data.result) {
        walletTmp = {
          ...walletTmp,
          balances: responseBalances.data.result,
          validators: responseValidators.data.result,
          delegation: responseDelegation.data.result,
          unbondingDelegation: responseUnbondingDelegation.data.result,
          transactions: transactions,
          multisign: wallet.privatekey == "",
        };
      }
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
    const responseBalances = await services.wallet.fetchBalancesList(
      wallet.address /* 'tki1857lr2tn33q9usmlka0n5wppnxqnuyw0muavx3' */,
    );
    commit(SET_CURRENT_WALLET_BALANCES, responseBalances.data.result);
  },
};
