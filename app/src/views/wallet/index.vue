<template>
  <div class="p-4 w-100">
    <div class="tabs w-100">
      <router-link class="tab" :to="{ name: 'home' }">
        <unicon name="arrow-left" fill="black" />
      </router-link>
      <router-link
        class="tab"
        exact
        active-class="active"
        :to="{
          name: 'wallets_tx',
          params: { wallet_id: $route.params.wallet_id },
        }"
      >
        Transactions
      </router-link>
      <router-link
        class="tab"
        active-class="active"
        :to="{
          name: 'wallets_delegation',
          params: { wallet_id: $route.params.wallet_id },
        }"
      >
        Delegation
      </router-link>
      <router-link
        class="tab"
        active-class="active"
        :to="{
          name: 'wallets_withdraw',
          params: { wallet_id: $route.params.wallet_id },
        }"
      >
        Withdraw
      </router-link>
    </div>
    <div class="p-4 w-100">
      <router-view />
    </div>
  </div>
</template>

<script>
import { BContainer } from 'bootstrap-vue';
import { services } from '@services/index';
import { mapActions, mapGetters, mapState } from 'vuex';
import { FETCH_WALLET_BALANCES, HYDRATE_CURRENT_WALLET } from '@store/wallets';
import { HYDRATE_ACCOUNT } from '@store/account';

export default {
  computed: {
    ...mapState({
      currentWallet: state => state.wallets.current,
    }),
  },
  mounted() {
    // If currentWallet is not empty at mounted lifecycle
    // => That means we have a current wallet already in the localstorage
    // => But without balances datas => We fetch all datas we need
    if (this.currentWallet !== null) {
      this.hydrateCurrentWallet(this.currentWallet);
      this.hydrateAccount(this.currentWallet.address);
    }
  },
  methods: {
    ...mapActions({
      hydrateAccount: HYDRATE_ACCOUNT,
      hydrateCurrentWallet: HYDRATE_CURRENT_WALLET,
    }),
  },
};
</script>

<style scoped>
.tabs .tab {
  padding-bottom: 5px;
}
</style>
