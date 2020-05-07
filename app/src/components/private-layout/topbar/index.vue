<template>
  <div
    class="px-4 w-100 h-100 rounded d-flex align-items-center"
    :style="{ backgroundColor: 'white' }"
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
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    NoWalletActions,
    WalletActions,
  },
  computed: {
    ...mapState({
      currentWallet: state => state.wallets.current,
    }),
  },
  mounted() {},
};
</script>

<style scoped></style>
