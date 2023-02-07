import { PriceApiService } from './price-api.service';

export class PriceService extends PriceApiService {
  async fetchPrice() {
    return this.get(`/`);
  }
}
