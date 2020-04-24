import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { TxService } from '@services/tx.service';
import { TransferService } from '@services/transfer.service';
import config from '@static/js/config';

export const services = {
  api: new ApiService(config.kichain.nodeUrl),
  auth: new AuthService(),
  transfer: new TransferService(),
  tx: new TxService(),
  setToken: ApiService.setToken,
};
