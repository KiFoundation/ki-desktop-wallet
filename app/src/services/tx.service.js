import { ApiService } from './api.service';

export class TxService extends ApiService {
  async fetchTxsList() {
    return this.get(
      `/auth/accounts/tki17snspval00dffwye6vqvlkmh5nel2xu70re7cf`,
    );
  }
}
