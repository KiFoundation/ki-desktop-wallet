import {
  ApiService
} from './api.service';

export class TxService extends ApiService {
  async fetchTxsList(filter) {
    return this.get(`/txs`, filter);
  }
  async postTx(transaction) {
    return this.post('/txs', transaction);
  }
  async postMsTx(transaction) {
    return this.post('/cosmos/tx/v1beta1/txs', transaction);
  }
}