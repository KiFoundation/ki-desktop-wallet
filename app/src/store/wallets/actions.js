import { services } from '@services/index';
import {
  SET_CURRENT_WALLET_BALANCES,
  SET_CURRENT_WALLET,
  SET_CURRENT_WALLET_VALIDATORS,
  SET_CURRENT_WALLET_REWARDS,
  START_HYDRATE,
  END_HYDRATE,
} from './mutations';

export const HYDRATE_CURRENT_WALLET = 'HYDRATE_CURRENT_WALLET';
export const FETCH_WALLET_BALANCES = 'FETCH_WALLET_BALANCES';
export const FETCH_WALLET_VALIDATORS = 'FETCH_WALLET_VALIDATORS';
export const FETCH_WALLET_REWARDS = 'FETCH_WALLET_REWARDS';

import util from '@static/js/util';
import { tokenUtil } from '@static/js/token';

export const actions = {
  [HYDRATE_CURRENT_WALLET]: async (
    { commit, state },
    wallet,
  ) => {
    let walletTmp = (wallet && Object.assign({}, wallet)) || null;
    if (walletTmp) {
      commit(START_HYDRATE);

      // Check the wallet type (vesting?)
      const account = await services.auth.fetchAccount(
        wallet.address,
      );

      let vesting = account.data.result.type == "/cosmos.vesting.v1beta1.ContinuousVestingAccount" || account.data.result.type == "/cosmos.vesting.v1beta1.DelayedVestingAccount";
      let vesting_delayed = account.data.result.type == "/cosmos.vesting.v1beta1.DelayedVestingAccount";


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


      // Fetch wallet transactions 
      let transactions = []

      // Fetch the sent transactions
      let transactionsRaw = []

      const responseWalletTransactionsSendPage = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.bank.v1beta1.MsgSend'"] },
      );

      const responseWalletTransactionsSendPage_legacy = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='send'"] },
      );

      let limit = 100
      let pages = Math.ceil(responseWalletTransactionsSendPage.data.pagination.total / limit)
      let pages_legacy = Math.ceil(responseWalletTransactionsSendPage_legacy.data.pagination.total / limit)

      for (var page = 0; page < pages; page++) {
        try {
          let responseWalletTransactionsSend = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.bank.v1beta1.MsgSend'"], "pagination.offset": limit * page },
          );

          transactionsRaw = transactionsRaw.concat(responseWalletTransactionsSend.data.tx_responses)
        } catch (error) {

        }
      }

      for (var page = 0; page < pages_legacy; page++) {
        try {
          let responseWalletTransactionsSend_legacy = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='send'"], "pagination.offset": limit * page },
          );

          transactionsRaw = transactionsRaw.concat(responseWalletTransactionsSend_legacy.data.tx_responses)
        } catch (error) {

        }
      }

      for (var tx_key in transactionsRaw) {

        var tx = transactionsRaw[tx_key]

        let fee = 0
        if (tx.tx.auth_info.fee.amount.length > 0) {
          fee = tx.tx.auth_info.fee.amount[0].amount / Math.pow(10, 6)
        }

        if (tx.tx.body.messages.length == 1) {

          transactions.push([tx.txhash, 'send',
          tx.tx.body.messages[0].to_address,
          tokenUtil.format(tx.tx.body.messages[0].amount[0].amount),
            fee, tx.timestamp, tx.tx.body.messages[0].from_address, ,
          ])
        }
        else {
          transactions.push([tx.txhash, 'multiple',
            "",
            "",
            fee, tx.timestamp, wallet.address
          ])
        }

      }

      // Fetch the recieved transactions
      transactionsRaw = []

      const responseWalletTransactionsReceivePage = await services.tx.fetchTxsList(
        { events: [`transfer.recipient='${wallet.address}'`, "message.action='/cosmos.bank.v1beta1.MsgSend'"] },
      );
      const responseWalletTransactionsReceivePage_legacy = await services.tx.fetchTxsList(
        { events: [`transfer.recipient='${wallet.address}'`, "message.action='send'"] },
      );

      pages = Math.ceil(responseWalletTransactionsReceivePage.data.pagination.total / limit)
      pages_legacy = Math.ceil(responseWalletTransactionsReceivePage_legacy.data.pagination.total / limit)

      for (var page = 0; page < pages; page++) {
        try {
          let responseWalletTransactionsReceive = await services.tx.fetchTxsList(
            { events: [`transfer.recipient='${wallet.address}'`, "message.action='/cosmos.bank.v1beta1.MsgSend'"], "pagination.offset": limit * page },
          );

          transactionsRaw = responseWalletTransactionsReceive.data.tx_responses
        } catch (error) {

        }
      }

      for (var page = 0; page < pages_legacy; page++) {
        try {
          let responseWalletTransactionsReceive_legacy = await services.tx.fetchTxsList(
            { events: [`transfer.recipient='${wallet.address}'`, "message.action='send'"], "pagination.offset": limit * page },
          );

          transactionsRaw = transactionsRaw.concat(responseWalletTransactionsReceive_legacy.data.tx_responses)
        } catch (error) {

        }
      }

      for (var tx_key in transactionsRaw) {

        var tx = transactionsRaw[tx_key]

        let fee = 0
        if (tx.tx.auth_info.fee.amount.length > 0) {
          fee = tx.tx.auth_info.fee.amount[0].amount / Math.pow(10, 6)
        }

        if (tx.tx.body.messages.length == 1) {
          transactions.push([tx.txhash, 'receive',
          tx.tx.body.messages[0].to_address,
          tokenUtil.format(tx.tx.body.messages[0].amount[0].amount),
            fee, tx.timestamp, tx.tx.body.messages[0].from_address,
          ])
        }
        else {
          transactions.push([tx.txhash, 'multiple',
            "",
            "",
            fee, tx.timestamp, ""
          ])
        }
      }

      // Fetch the delegate transactions
      transactionsRaw = []
      const responseWalletTransactionsDelegatePage = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.staking.v1beta1.MsgDelegate'"] },
      );

      const responseWalletTransactionsDelegatePage_legacy = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='delegate'"] },
      );
      pages = Math.ceil(responseWalletTransactionsDelegatePage.data.pagination.total / limit)
      pages_legacy = Math.ceil(responseWalletTransactionsDelegatePage_legacy.data.pagination.total / limit)

      for (var page = 0; page < pages; page++) {
        try {
          let responseWalletTransactionsDelegate = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.staking.v1beta1.MsgDelegate'"], "pagination.offset": limit * page },
          );

          transactionsRaw = responseWalletTransactionsDelegate.data.tx_responses
        } catch (error) {
        }
      }

      for (var page = 0; page < pages_legacy; page++) {

        try {
          let responseWalletTransactionsDelegate_legacy = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='delegate'"], "pagination.offset": limit * page },
          );

          transactionsRaw = transactionsRaw.concat(responseWalletTransactionsDelegate_legacy.data.tx_responses)
        } catch (error) {
        }
      }


      for (var tx_key in transactionsRaw) {
        var tx = transactionsRaw[tx_key]

        let fee = 0

        if (tx.tx.auth_info.fee.amount.length > 0) {
          fee = tx.tx.auth_info.fee.amount[0].amount / Math.pow(10, 6)
        }

        if (tx.tx.body.messages.length == 1) {
          transactions.push([tx.txhash, 'delegate',
          tx.tx.body.messages[0].validator_address,
          tokenUtil.format(tx.tx.body.messages[0].amount.amount),
            fee, tx.timestamp, tx.tx.body.messages[0].delegator_address
          ])
        }
        else {
          transactions.push([tx.txhash, 'multiple',
            "",
            "",
            fee, tx.timestamp, wallet.address
          ])
        }
      }

      // Fetch the redelegate transactions
      transactionsRaw = []
      const responseWalletTransactionsRedelegatePage = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.staking.v1beta1.MsgBeginRedelegate'"] },
      );

      const responseWalletTransactionsRedelegatePage_legacy = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='begin_redelegate'"] },
      );

      pages = Math.ceil(responseWalletTransactionsRedelegatePage.data.pagination.total / limit)
      pages_legacy = Math.ceil(responseWalletTransactionsRedelegatePage_legacy.data.pagination.total / limit)

      for (var page = 0; page < pages; page++) {
        try {
          let responseWalletTransactionsReDelegate = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.staking.v1beta1.MsgBeginRedelegate'"], "pagination.offset": limit * page },
          );

          transactionsRaw = responseWalletTransactionsReDelegate.data.tx_responses

        } catch (error) {

        }
      }

      for (var page = 0; page < pages_legacy; page++) {
        try {
          let responseWalletTransactionsReDelegate_legacy = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='begin_redelegate'"], "pagination.offset": limit * page },
          );

          transactionsRaw = transactionsRaw.concat(responseWalletTransactionsReDelegate_legacy.data.tx_responses)
        } catch (error) {

        }
      }


      for (var tx_key in transactionsRaw) {
        var tx = transactionsRaw[tx_key]

        let fee = 0

        if (tx.tx.auth_info.fee.amount.length > 0) {
          fee = tx.tx.auth_info.fee.amount[0].amount / Math.pow(10, 6)
        }

        if (tx.tx.body.messages.length == 1) {

          transactions.push([tx.txhash, 'redelegate',
          tx.tx.body.messages[0].validator_dst_address,
          tokenUtil.format(tx.tx.body.messages[0].amount.amount),
            fee, tx.timestamp, tx.tx.body.messages[0].validator_src_address
          ])
        }
        else {
          transactions.push([tx.txhash, 'multiple',
            "",
            "",
            fee, tx.timestamp, wallet.address
          ])
        }
      }

      // Fetch the undelegate transactions
      transactionsRaw = []
      const responseWalletTransactionsUndelegatePage = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.staking.v1beta1.MsgUndelegate'"] },
      );

      const responseWalletTransactionsUndelegatePage_legacy = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='begin_unbonding'"] },
      );

      pages = Math.ceil(responseWalletTransactionsUndelegatePage.data.pagination.total / limit)
      pages_legacy = Math.ceil(responseWalletTransactionsUndelegatePage_legacy.data.pagination.total / limit)

      for (var page = 0; page < pages; page++) {
        try {
          let responseWalletTransactionsUnDelegate = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.staking.v1beta1.MsgUndelegate'"], "pagination.offset": limit * page },
          );

          transactionsRaw = responseWalletTransactionsUnDelegate.data.tx_responses
        } catch (error) {

        }
      }

      for (var page = 0; page < pages_legacy; page++) {
        try {
          let responseWalletTransactionsUnDelegate_legacy = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='begin_unbonding'"], "pagination.offset": limit * page },
          );

          transactionsRaw = transactionsRaw.concat(responseWalletTransactionsUnDelegate_legacy.data.tx_responses)
        } catch (error) {

        }
      }

      for (var tx_key in transactionsRaw) {
        var tx = transactionsRaw[tx_key]

        let fee = 0

        if (tx.tx.auth_info.fee.amount.length > 0) {
          fee = tx.tx.auth_info.fee.amount[0].amount / Math.pow(10, 6)
        }

        if (tx.tx.body.messages.length == 1) {
          transactions.push([tx.txhash, 'undelegate',
            "",
          tokenUtil.format(tx.tx.body.messages[0].amount.amount),
            fee, tx.timestamp, tx.tx.body.messages[0].validator_address,
          ])
        }
        else {
          transactions.push([tx.txhash, 'multiple',
            "",
            "",
            fee, tx.timestamp, wallet.address
          ])
        }
      }

      // Fetch the withdraw transactions
      transactionsRaw = []
      const responseWalletTransactionsWithdrawPage = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'"] },
      );

      const responseWalletTransactionsWithdrawPage_legacy = await services.tx.fetchTxsList(
        { events: [`message.sender='${wallet.address}'`, "message.action='withdraw_delegator_reward'"] },
      );

      pages = Math.ceil(responseWalletTransactionsWithdrawPage.data.pagination.total / limit)
      pages_legacy = Math.ceil(responseWalletTransactionsWithdrawPage_legacy.data.pagination.total / limit)

      for (var page = 0; page < pages; page++) {
        try {
          let responseWalletTransactionsWithdraw = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'"], "pagination.offset": limit * page },
          );

          transactionsRaw = responseWalletTransactionsWithdraw.data.tx_responses
        } catch (error) {

        }
      }

      for (var page = 0; page < pages_legacy; page++) {
        try {
          let responseWalletTransactionsWithdraw_legacy = await services.tx.fetchTxsList(
            { events: [`message.sender='${wallet.address}'`, "message.action='withdraw_delegator_reward'"], "pagination.offset": limit * page },
          );

          transactionsRaw = transactionsRaw.concat(responseWalletTransactionsWithdraw_legacy.data.tx_responses)
        } catch (error) {

        }
      }

      for (var tx_key in transactionsRaw) {
        var tx = transactionsRaw[tx_key]
        let fee = 0

        if (tx.tx.auth_info.fee.amount.length > 0) {
          fee = tx.tx.auth_info.fee.amount[0].amount / Math.pow(10, 6)
        }

        var amount = 0

        for (var msg in tx.tx.body.messages) {

          let withdraw_msg = tx.logs[msg].events.filter(e => {
            return e.type.includes('withdraw_rewards');
          })

          if (withdraw_msg.length > 0 && withdraw_msg[0].attributes) {

            amount += parseFloat(withdraw_msg[0].attributes[0].value.replace(state.app.denom, ''));
          }
        }

        if (tx.tx.body.messages.length == 1) {
          transactions.push([tx.txhash, 'withdraw',
            "",
          tokenUtil.formatShort(amount),
            fee, tx.timestamp, tx.tx.body.messages[0].validator_address,
          ])
        }
        else {
          transactions.push([tx.txhash, 'withdraw +' + (tx.tx.body.messages.length - 1),
            "",
          tokenUtil.formatShort(amount),
            fee, tx.timestamp, ""
          ])
        }
      }

      transactions.sort(function (a, b) {
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
      if (responseValidators.data.result) {
        for (var val in responseValidators.data.result) {
          validators_dict[responseValidators.data.result[val].operator_address] = responseValidators.data.result[val].description.moniker
        }
      }

      // Fetch wallet signers (for multisig wallets)
      let threshold;
      let signerList = []
      let description = ''
      let multisig_data = {}

      if (wallet.ms) {
        let ms_data;
        if (account.data.result.value.public_key == null) {
          var pubkeys_temp = []
          for (key of wallet.pubkeys) {
            pubkeys_temp.push({
              "type": "tendermint/PubKeySecp256k1",
              "value": key
            })
          }
          ms_data = {
            "threshold": wallet.threshold,
            "pubkeys": pubkeys_temp
          }
        }

        else {
          if (vesting) {
            ms_data = account.data.result.value.base_vesting_account.base_account.public_key.value
          }
          else {
            ms_data = account.data.result.value.public_key.value
          }
        }

        threshold = ms_data.threshold
        for (var key in ms_data.pubkeys) {
          signerList.push({
            'address': ms_data.pubkeys[key].value,
            'status': 'pending...'
          })
        }

        description = 'At least ' + threshold + ' out of ' + signerList.length + ' signatures are required'

        multisig_data['threshold'] = threshold;
        multisig_data['description'] = description;
        multisig_data['signerList'] = signerList;
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
        let original = parseFloat(res.base_vesting_account.original_vesting[0].amount);

        // get vesting period
        let start = res.start_time;
        let end = res.base_vesting_account.end_time;

        // get vested amount
        let total_duration = end - start
        let elapsed_duration = (Math.floor(Date.now() / 1000) - start > 0) ? Math.floor(Date.now() / 1000) - start : 0
        let vested_ratio = elapsed_duration / total_duration
        let locked_ = original * Math.max(1 - vested_ratio, 0)
        let vested = original - locked_

        if (vesting_delayed) {
          if (Math.floor(Date.now() / 1000) < end) {
            locked_ = original;
          }
          else {
            locked_ = 0;
          }
        }

        let delegated = res.base_vesting_account.delegated_vesting.length > 0 ? parseFloat(res.base_vesting_account.delegated_vesting[0].amount) : 0;

        locked = locked_

        res = account.data.result.value.base_vesting_account.base_account;
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


      if (responseBalances.data.result[0]) {
        available = parseInt(responseBalances.data.result[0].amount)
      }

      if (responseDelegation.data.result[0]) {
        for (var delegation in responseDelegation.data.result) {
          delegated += parseInt(responseDelegation.data.result[delegation].balance.amount)
        }
      }

      if (responseUnbondingDelegation.data.result[0]) {
        for (var delegation in responseUnbondingDelegation.data.result) {
          for (var entry in responseUnbondingDelegation.data.result[delegation].entries) {
            unbonding += parseInt(responseUnbondingDelegation.data.result[delegation].entries[entry].balance)
          }
        }
      }

      let balances = { "available": tokenUtil.format(available), "delegated": tokenUtil.format(delegated), "unbonding": tokenUtil.format(unbonding), "available_real": tokenUtil.format(available_real), "locked": tokenUtil.format(locked), "total": tokenUtil.format(available + delegated), "denom": state.app.denom }

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
          vesting: vesting,
          // multisign: false,
          multisign: wallet.ms,
          multisign_data: multisig_data,
          offline: wallet.offline,
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
  [FETCH_WALLET_REWARDS]: async ({ commit, state, getters, dispatch }) => {
    const responseRewards = await services.wallet.fetchDelegatorsRewards(
      state.wallets.current.address,
    );

    let rewards_dict = {}
    if (responseRewards.data.result.rewards) {
      for (var val in responseRewards.data.result.rewards) {
        var val_ = responseRewards.data.result.rewards[val]
        rewards_dict[val_.validator_address] = (val_.reward != null) ? tokenUtil.format(val_.reward[0].amount) : "0.0"
      }
    }

    commit(
      SET_CURRENT_WALLET_REWARDS,
      rewards_dict,
    );
  },
  [FETCH_WALLET_BALANCES]: async (
    { commit, state, getters, dispatch },
    walletId,
  ) => {


    commit(SET_CURRENT_WALLET_BALANCES, "");
  },

};
