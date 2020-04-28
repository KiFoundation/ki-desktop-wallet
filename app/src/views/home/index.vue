<template>
  <b-container class="py-5 px-0 my-3">
    <WalletsList @onSelectWallet="handleSelectWallet" />
  </b-container>
</template>

<script>
import { BContainer } from 'bootstrap-vue';
import WalletsList from '@cmp/wallets/wallets-list';
import { mutations } from '@store';
import { mapMutations, mapActions, mapState } from 'vuex';
import { HYDRATE_CURRENT_WALLET } from '@store/wallets';

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
    }),
    handleSelectWallet(wallet) {
      this.hydrateCurrentWallet(wallet);
    },
  },
};
</script>

<style scoped></style>
