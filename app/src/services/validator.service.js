import { ApiService } from './api.service';

export class ValidatorService extends ApiService {
  async fetchValidatorsList(filter) {
    return this.get('/staking/validators', filter);
  }
}
