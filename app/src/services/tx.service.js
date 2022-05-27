import {
  ApiService
} from './api.service';

export class TxService extends ApiService {
  async fetchTxsList(filter) {
    return this.get(`/cosmos/tx/v1beta1/txs`, filter);
  }
  async postTx(transaction) {
    return this.post('/txs?sync=true', transaction);
  }
  async postMsTx(transaction) {
    return this.post('/cosmos/tx/v1beta1/txs', transaction);
  }
}