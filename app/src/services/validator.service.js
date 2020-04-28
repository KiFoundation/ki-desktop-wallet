import { ApiService } from './api.service';

export class ValidatorService extends ApiService {
  async fetchValidatorsList() {
    return this.get('/staking/validators');
  }
}
