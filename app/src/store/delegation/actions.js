import { services } from '@services/index';
import { INIT_DELEGATE, DELEGATE_ERROR, DELEGATE_SUCCESS } from './mutations';
import * as CryptoJS from 'crypto-js';
import { signTx, createBroadcastTx } from '@tendermint/sig';

export const POST_DELEGATE = 'POST_DELEGATE';
export const POST_UNDELEGATE = 'POST_UNDELEGATE';
export const POST_REDELEGATE = 'POST_REDELEGATE';

export const actions = {
  [POST_DELEGATE]: async (
    { commit, state, getters, dispatch },
    { transaction, password },
  ) => {
    try {
      commit(INIT_DELEGATE);
      //
      const account = await services.auth.fetchAccount(
        state.wallets.current.address,
      );

      let sequence;
      if (account.data.result.value) {
        let res = '';
        if (account.data.result.type == 'cosmos-sdk/ContinuousVestingAccount' || account.data.result.type == 'cosmos-sdk/DelayedVestingAccount') {
          res = account.data.result.value.BaseVestingAccount.BaseAccount;
        } else {
          res = account.data.result.value;
        }
        sequence = res.sequence;

        const signMeta = {
          chain_id: state.app.chainId,
          account_number: state.account.value.account_number.toString(),
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

        const responsePostTransfer = await services.transfer.postTransfer(
          bcTransactionme,
        );
        commit(DELEGATE_SUCCESS, responsePostTransfer);
        return responsePostTransfer;
      }
    } catch (error) {
      let humanizedError;
      if (RegExp(`^RangeError: private key length is invalid`).test(error)) {
        humanizedError = 'Wrong Password';
      }
      commit(DELEGATE_ERROR, humanizedError);
      throw new Error(humanizedError).message;
    }
  },
};
