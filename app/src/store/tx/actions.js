import { services } from '@services/index';
import { INIT_TX, TX_ERROR, TX_SUCCESS } from './mutations';
import * as CryptoJS from 'crypto-js';
import { signTx, createBroadcastTx } from '@tendermint/sig';

export const POST_TX = 'POST_TX';

export const actions = {
  [POST_TX]: async (
    { commit, state, getters, dispatch },
    { transaction, password },
  ) => {
    try {
      commit(INIT_TX);
      //
      const account = await services.auth.fetchAccount(
        state.wallets.current.address,
      );

      let sequence;
      let account_number ;
      if (account.data.result.value) {
        let res = '';
        if (account.data.result.type == 'cosmos-sdk/ContinuousVestingAccount' || account.data.result.type == 'cosmos-sdk/DelayedVestingAccount') {
          res = account.data.result.value.base_vesting_account.base_account;
        } else {
          res = account.data.result.value;
        }

        sequence = res.sequence || 0;
        account_number = res.account_number || 0;

        const signMeta = {
          chain_id: state.app.chainId,
          account_number: account_number.toString(),
          sequence: sequence.toString(),
        };

        // Decrypt privateKey
        const bytes = CryptoJS.AES.decrypt(
          state.wallets.current.privatekey,
          password,
        );
        const key = Buffer.from(bytes.toString(CryptoJS.enc.Utf8), 'hex');

        // Read publicKey
        const publickey = Buffer.from(state.wallets.current.publickey, 'hex');

        // Sign TxObject
        let signedTransactionme = signTx(transaction, signMeta, {
          privateKey: key,
          publicKey: publickey,
        });

        const bcTransactionme = createBroadcastTx(signedTransactionme);

        const responsePostTransfer = await services.tx.postTx(bcTransactionme);
        commit(TX_SUCCESS, responsePostTransfer);
        return responsePostTransfer;
      }
    } catch (error) {
      let humanizedError;
      if (
        RegExp(
          `^RangeError: private key length is invalid|Malformed UTF-8 data`,
        ).test(error)
      ) {
        humanizedError = 'Wrong Password';
      }
      commit(TX_ERROR, humanizedError);
      throw new Error(humanizedError).message;
    }
  },
};
