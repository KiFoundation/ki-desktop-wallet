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
    console.log('POST_TRANSFER :: ', state);
    // Loading init
    commit(INIT_TRANSFER);
    //
    const response = await services.auth.fetchAccount(
      state.wallets.current.address,
    );

    let sequence;
    if (response.data.result.value) {
      let res = '';
      if (response.data.result.type == 'cosmos-sdk/ContinuousVestingAccount') {
        res = response.data.result.value.BaseVestingAccount.BaseAccount;
      } else {
        res = response.data.result.value;
      }
      sequence = res.sequence;

      const signMeta = {
        chain_id: state.app.chainId,
        account_number: state.account.value.account_number.toString(),
        sequence: sequence.toString(),
      };

      let key;
      try {
        // Decrypt privateKey
        var bytes = CryptoJS.AES.decrypt(
          state.wallets.current.privatekey,
          password,
        );
        key = Buffer.from(bytes.toString(CryptoJS.enc.Utf8), 'hex');
      } catch (error) {
        // console.log(error);
        commit(TRANSFER_ERROR, error);
      }

      // Read publicKey
      const publickey = Buffer.from(state.wallets.current.publickey, 'hex');

      console.log('Sign Meta :: ', signMeta);

      // Sign TxObject
      let signedTransactionme = signTx(transaction, signMeta, {
        privateKey: key,
        publicKey: publickey,
      });

      // console.log('signedTransactionme :: ', JSON.stringify(signedTransactionme));

      const bcTransactionme = createBroadcastTx(signedTransactionme);

      // console.log('bcTransactionme :: ', JSON.stringify(bcTransactionme));


      const responsePostTransfer = await services.transfer.postTransfer(
        bcTransactionme,
      );
      // console.log('responsePostTransfer :: ', responsePostTransfer);
    }
  },
};
