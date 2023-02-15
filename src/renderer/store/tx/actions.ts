import { services } from '@services/index';
import { INIT_TX, TX_ERROR, TX_SUCCESS } from './mutations';
import * as CryptoJS from 'crypto-js';
import util from '@helpers/util';

export const POST_TX = 'POST_TX';

export const actions = {
  [POST_TX]: async ({ commit, state, getters, dispatch }, { transaction, password }) => {
    try {
      commit(INIT_TX);
      //
      const account = await services.auth.fetchAccount(state.wallets.current.address);
      let sequence;
      let account_number;
      if (account.data.result.value) {
        let res = {};
        if (
          account.data.result.type == 'cosmos-sdk/ContinuousVestingAccount' ||
          account.data.result.type == 'cosmos-sdk/DelayedVestingAccount'
        ) {
          res = account.data.result.value.base_vesting_account.base_account;
        } else {
          res = account.data.result.value;
        }

        sequence = res.sequence || 0;
        account_number = res.account_number || 0;

        // Decrypt privateKey
        const bytes = CryptoJS.AES.decrypt(state.wallets.current.privatekey, password);
        const key = Buffer.from(bytes.toString(CryptoJS.enc.Utf8), 'hex');

        const signingInstruction = {
          accountNumber: parseInt(account_number),
          sequence: parseInt(sequence),
          chainId: transaction.chainId,
          msgs: transaction.msg,
          fee: transaction.fees,
          memo: transaction.memo,
        };

        const signedTx_b64 = await util.singleSign(signingInstruction, key, transaction.prefix);

        const bcTransactionme = {
          tx_bytes: signedTx_b64,
          mode: 'BROADCAST_MODE_SYNC',
        };

        const responsePostTransfer = await services.tx.postMsTx(bcTransactionme);
        commit(TX_SUCCESS, responsePostTransfer);
        return responsePostTransfer;
      }
    } catch (error) {
      console.log(error);
      let humanizedError;
      if (RegExp(`^RangeError: private key length is invalid|Malformed UTF-8 data`).test(error)) {
        humanizedError = 'Wrong Password';
      }
      commit(TX_ERROR, humanizedError);
      throw new Error(humanizedError).message;
    }
  },
};
