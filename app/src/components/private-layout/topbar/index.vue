<template>
  <div
    class="px-4 w-100 h-100 rounded d-flex align-items-center"
    :style="{ backgroundColor: '#062ca3' }"
  >
    <template v-if="!currentWallet">
      <NoWalletActions />
    </template>
    <template v-else>
      <WalletActions />
    </template>
  </div>
</template>

<script>
import NoWalletActions from './no-wallet-actions';
import WalletActions from './wallet-actions';
import { store, getters } from '@store';

export default {
  computed: {
    currentWallet() {
      return getters.currentWallet();
    },
  },
  components: {
    NoWalletActions,
    WalletActions,
  },
};
</script>

<style scoped></style>
