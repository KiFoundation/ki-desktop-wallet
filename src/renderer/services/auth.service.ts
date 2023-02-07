import { ApiService } from './api.service';

export class AuthService extends ApiService {
  async fetchAccount(address) {
    return this.get(`/auth/accounts/${address}`);
  }
}
