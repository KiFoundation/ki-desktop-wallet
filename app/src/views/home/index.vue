<template>
  <b-container class="py-5 px-0 my-3">
    <WalletsList @onSelectWallet="handleSelectWallet" />
  </b-container>
</template>

<script>
import { BContainer } from 'bootstrap-vue';
import WalletsList from '@cmp/wallets/wallets-list';
import { mutations } from '@store';

export default {
  components: {
    WalletsList,
    BContainer,
  },
  mounted() {
    mutations.setCurrentWallet(null);
  },
  methods: {
    handleSelectWallet(wallet) {
      mutations.setCurrentWallet(wallet);
    },
  },
};
</script>

<style scoped></style>
