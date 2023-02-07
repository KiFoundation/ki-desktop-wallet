import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { TxService } from '@services/tx.service';
import { WalletService } from './wallet.service';
import { ValidatorService } from './validator.service';

export const services = {
  api: new ApiService(),
  auth: new AuthService(),
  tx: new TxService(),
  wallet: new WalletService(),
  validator: new ValidatorService(),
  setToken: ApiService.setToken,
};
