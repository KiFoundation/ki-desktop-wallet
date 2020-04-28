<template>
  <b-row v-if="list.length" class="w-100 mx-0">
    <b-col v-for="(wallet, index) in list" :key="index" cols="4" class="mb-4">
      <router-link
        :to="{ name: 'wallets_tx', params: { wallet_id: wallet.address } }"
      >
        <WalletCard :wallet="wallet" @onSelectWallet="onSelectWallet" />
      </router-link>
    </b-col>
  </b-row>
  <b-row v-else>
    <b-col>
      No wallets
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue';
import WalletCard from '@cmp/wallets/wallet-card';
import { mapState } from 'vuex';

export default {
  components: {
    WalletCard,
    BRow,
    BCol,
  },
  computed: {
    ...mapState({
      list: state => state.wallets.list,
    }),
  },
  methods: {
    onSelectWallet(wallet) {
      this.$emit('onSelectWallet', wallet);
    },
  },
};
</script>

<style scoped></style>
