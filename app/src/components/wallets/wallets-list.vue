<template>
  <b-row v-if="list.length" class="w-100 mx-0 pl-3">
    <b-col
      v-for="(wallet, index) in list"
      :key="index"
      cols="4"
      :class="[
        'mb-3 pl-0 pr-3',
      ]"
    >
      <WalletCard :wallet="wallet" @onSelectWallet="onSelectWallet" />
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
