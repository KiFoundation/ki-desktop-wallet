import { ApiService } from './api.service';

export class TransferService extends ApiService {
  async postTransfer(transaction) {
    return this.post('/txs?sync=true', transaction);
  }
}
