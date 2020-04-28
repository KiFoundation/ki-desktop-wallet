<template>
  <b-container fluid class="p-4 my-3">
    <WalletsList @onSelectWallet="handleSelectWallet" />
  </b-container>
</template>

<script>
import { BContainer } from 'bootstrap-vue';
import WalletsList from '@cmp/wallets/wallets-list';
import { mutations } from '@store';
import { mapMutations, mapActions, mapState } from 'vuex';
import { HYDRATE_CURRENT_WALLET } from '@store/wallets';
import { HYDRATE_ACCOUNT } from '@store/account';

export default {
  components: {
    WalletsList,
    BContainer,
  },
  mounted() {
    this.hydrateCurrentWallet(null);
  },
  methods: {
    ...mapActions({
      hydrateCurrentWallet: HYDRATE_CURRENT_WALLET,
      hydrateAccount: HYDRATE_ACCOUNT,
    }),
    handleSelectWallet(wallet) {
      this.hydrateAccount(wallet.address);
      this.hydrateCurrentWallet(wallet);
    },
  },
};
</script>

<style scoped></style>
