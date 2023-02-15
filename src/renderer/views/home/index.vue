<template>
  <div class="py-4 w-100" style="overflow-y: auto; overflow-x: hidden">
    <WalletsList @onSelectWallet="handleSelectWallet" />
  </div>
</template>

<script lang="ts">
import WalletsList from '@cmp/wallets/wallets-list.vue';
import { mapActions } from 'vuex';
import { HYDRATE_CURRENT_WALLET } from '@store/wallets';
import { HYDRATE_ACCOUNT } from '@store/account';
import router from '@router/index';

export default {
  components: {
    WalletsList,
  },
  mounted() {
    this.hydrateCurrentWallet(null);
  },
  methods: {
    ...mapActions({
      hydrateCurrentWallet: HYDRATE_CURRENT_WALLET,
      hydrateAccount: HYDRATE_ACCOUNT,
    }),
    async handleSelectWallet(wallet) {
      // Save into local storage
      localStorage.setItem('current_wallet', JSON.stringify(wallet));
      // Navigate to Wallet page
      router.push({
        name: 'wallets_tx',
        params: { wallet_id: wallet.address },
      });
    },
  },
};
</script>

<style scoped></style>
