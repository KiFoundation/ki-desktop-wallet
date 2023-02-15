<template>
  <div class="px-4 w-100 h-100 rounded d-flex align-items-center" :style="{ backgroundColor: 'white' }">
    <template v-if="!currentWallet">
      <NoWalletActions />
    </template>
    <template v-else>
      <WalletActions />
    </template>
  </div>
</template>

<script lang="ts">
import NoWalletActions from './no-wallet-actions.vue';
import WalletActions from './wallet-actions.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    NoWalletActions,
    WalletActions,
  },
  computed: {
    ...mapState({
      currentWallet: (state) => state.wallets.current,
    }),
  },
  mounted() {},
};
</script>

<style scoped></style>
