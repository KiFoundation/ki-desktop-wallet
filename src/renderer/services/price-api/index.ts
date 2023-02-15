import { PriceApiService } from './price-api.service';
import { PriceService } from './price.service';

export const priceservices = {
  priceApi: new PriceApiService(),
  price: new PriceService(),
};
