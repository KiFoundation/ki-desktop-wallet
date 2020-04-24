import WalletsIndex from './index';
import WalletsTx from './transactions';
import WalletsDelegation from './delegation';
import WalletsWithDraw from './withdraw';

export const router = {
  name: 'wallets',
  component: WalletsIndex,
  path: '/wallets/:wallet_id',
  children: [
    {
      name: 'wallets_tx',
      component: WalletsTx,
      path: '/wallets/:wallet_id/',
    },
    {
      name: 'wallets_delegation',
      component: WalletsDelegation,
      path: '/wallets/:wallet_id/delegation',
    },
    {
      name: 'wallets_withdraw',
      component: WalletsWithDraw,
      path: '/wallets/:wallet_id/withdraw',
    },
  ],
};
