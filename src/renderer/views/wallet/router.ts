import WalletsIndex from './index.vue';
import WalletsTx from './transactions/index.vue';
import WalletsDelegation from './delegation/index.vue';
import WalletsWithDraw from './withdraw/index.vue';
import WalletsSign from './sign/index.vue';
import WalletsMultisign from './multisign/index.vue';

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
    {
      name: 'wallets_sign',
      component: WalletsSign,
      path: '/wallets/:wallet_id/sign',
    },
    {
      name: 'wallets_multisign',
      component: WalletsMultisign,
      path: '/wallets/:wallet_id/multisign',
    },
  ],
};
