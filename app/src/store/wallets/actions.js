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
import { tokenUtil } from '@static/js/token';

export const actions = {
  [HYDRATE_CURRENT_WALLET]: async (
    { commit, state, getters, dispatch, rootState },
    wallet,
  ) => {
    let walletTmp = (wallet && Object.assign({}, wallet)) || null;
    if (walletTmp) {
      commit(START_HYDRATE);

      // Check the wallet type (vesting?)
      const account = await services.auth.fetchAccount(
        wallet.address,
      );

      let vesting =  account.data.result.type == "cosmos-sdk/ContinuousVestingAccount"? true : false;

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
                tokenUtil.format(tx.tx.value.msg[0].value.amount[0].amount),
                fee, tx.timestamp,tx.tx.value.msg[0].value.from_address,
              ])
            }
          }
        }

      // Fetch the recieved transactions
      const responseWalletTransactionsReceivePage = await services.tx.fetchTxsList(
        {"transfer.recipient" : wallet.address, "message.action": "send" },
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
                tokenUtil.format(tx.tx.value.msg[0].value.amount[0].amount),
                fee, tx.timestamp, tx.tx.value.msg[0].value.from_address,
              ])
            }
          }
        }


        // Fetch the delegate transactions
      const responseWalletTransactionsDelegatePage = await services.tx.fetchTxsList(
        {"message.sender" : wallet.address, "message.action": "delegate" },
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
                tokenUtil.format(tx.tx.value.msg[0].value.amount.amount),
                fee, tx.timestamp, tx.tx.value.msg[0].value.delegator_address
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


      // Build a validator dict with  index= address and value= moniker
      let validators_dict = {}
      if (responseValidators.data.result){
        for (var val in responseValidators.data.result){
          validators_dict[responseValidators.data.result[val].operator_address] =  responseValidators.data.result[val].description.moniker
        }
      }

      // Fetch wallet signers (for multisig wallets)
      let threshold ;
      let signerList = []
      let description = ''
      let multisig_data = {}

      if (wallet.privatekey == ""){
        let ms_data ;
        if (vesting){
          ms_data = account.data.result.value.BaseVestingAccount.BaseAccount.public_key.value
        }
        else{
          ms_data = account.data.result.value.public_key.value
        }

        threshold = ms_data.threshold
        for (var key in ms_data.pubkeys) {
          signerList.push({
            'address': ms_data.pubkeys[key].value,
            'status': 'pending...'
          })
        }

          description = 'At least ' + threshold + ' out of ' + signerList.length + ' signatures are required'

          multisig_data['threshold']= threshold;
          multisig_data['description']= description;
          multisig_data['signerList']= signerList;
      }


      // fetch all balances
      let delegated = 0;
      let available = 0;
      let available_real = 0;
      let unbonding = 0;
      let locked = 0;

      if (vesting) {
        let res = account.data.result.value

        // get the original vesting
        let original = parseFloat(res.BaseVestingAccount.original_vesting[0].amount);

        // get vesting period
        let start = res.start_time;
        let end = res.BaseVestingAccount.end_time;

        // get vested amount
        let total_duration = end - start
        let elapsed_suration = (Math.floor(Date.now() / 1000) - start > 0) ? Math.floor(Date.now() / 1000) - start : 0
        let vested_ratio = elapsed_suration / total_duration
        let locked_ = original * (1 - vested_ratio)
        let vested = original - locked_

        let delegated = res.BaseVestingAccount.delegated_vesting.length > 0 ? parseFloat(res.BaseVestingAccount.delegated_vesting[0].amount) : 0;

        locked = locked_

        res = account.data.result.value.BaseVestingAccount.BaseAccount;
        let coins = res.coins;

        if (coins) {
          coins.forEach((coin) => {
            if (coin.denom == state.app.denom) {
              available = parseFloat(coin.amount) - locked_ + delegated;
              available_real = parseFloat(coin.amount);
            }
          });
        }
      } else {
        let res = account.data.result.value;
        let coins = res.coins;
        if (coins) {
          coins.forEach((coin) => {
            if (coin.denom == state.app.denom) {
              available = parseFloat(coin.amount);
              available_real = available
            }
          });
        }
      }


      if(responseBalances.data.result[0]){
        available = parseInt(responseBalances.data.result[0].amount)
      }

      if(responseDelegation.data.result[0]){
        for (var delegation in responseDelegation.data.result) {
          delegated += parseInt(responseDelegation.data.result[delegation].balance)
        }

      }

      if(responseUnbondingDelegation.data.result[0]){
        for (var delegation in responseUnbondingDelegation.data.result) {
          for (var entry in responseUnbondingDelegation.data.result[delegation].entries){
              unbonding += parseInt(responseUnbondingDelegation.data.result[delegation].entries[entry].balance)
          }
        }
      }

      let balances = {"available":tokenUtil.format(available), "delegated":tokenUtil.format(delegated), "unbonding":tokenUtil.format(unbonding), "available_real":tokenUtil.format(available_real), "locked":tokenUtil.format(locked), "denom":state.app.denom }

      if (responseBalances.data.result) {
        walletTmp = {
          ...walletTmp,
          bgImageStyle: util.generateWalletGradient(wallet.address),
          balances: balances,
          validators: responseValidators.data.result,
          validators_dict: validators_dict,
          delegation: responseDelegation.data.result,
          unbondingDelegation: responseUnbondingDelegation.data.result,
          transactions: transactions,
          vesting:vesting,
          // multisign: false,
          multisign: wallet.privatekey == "",
          multisign_data: multisig_data,
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


    commit(SET_CURRENT_WALLET_BALANCES, "");
  },
};
