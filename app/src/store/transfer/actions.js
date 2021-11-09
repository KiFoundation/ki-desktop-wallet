import { services } from '@services/index';
import { INIT_TRANSFER, TRANSFER_ERROR } from './mutations';
import * as CryptoJS from 'crypto-js';
import { signTx, createBroadcastTx } from '@tendermint/sig';

export const POST_TRANSFER = 'POST_TRANSFER';

export const actions = {
  [POST_TRANSFER]: async (
    { commit, state, getters, dispatch },
    { transaction, password },
  ) => {
    // console.log('POST_TRANSFER :: ', state);
    try {
    commit(INIT_TRANSFER);
    //
    const response = await services.auth.fetchAccount(
      state.wallets.current.address,
    );


    let sequence;
    let account_number ;
    if (response.data.result.value) {
      let res = '';
      if (response.data.result.type == 'cosmos-sdk/ContinuousVestingAccount'  || account.data.result.type == 'cosmos-sdk/DelayedVestingAccount') {
        res = response.data.result.value.base_vesting_account.base_account;
      } else {
        res = response.data.result.value;
      }
      sequence = res.sequence;
      account_number = res.account_number;

      const signMeta = {
        chain_id: state.app.chainId,
        account_number: account_number.toString(),
        sequence: sequence.toString(),
      };


      let key;
      var bytes = CryptoJS.AES.decrypt(
        state.wallets.current.privatekey,
        password,
      );
      key = Buffer.from(bytes.toString(CryptoJS.enc.Utf8), 'hex');

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
      commit(TRANSFER_SUCCESS, responsePostTransfer);
      return responsePostTransfer;
    }
  }catch(error){
      let humanizedError;
      if (RegExp(`^RangeError: private key length is invalid`).test(error)) {
        humanizedError = 'Wrong Password';
      }
      commit(TRANSFER_ERROR, humanizedError);
      throw new Error(humanizedError).message;
    }
  },
};
