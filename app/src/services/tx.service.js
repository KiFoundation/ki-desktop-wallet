import { ApiService } from './api.service';

export class TxService extends ApiService {
  async fetchTxsList(filter) {
    return this.get(`/txs`, filter);
  }
}
