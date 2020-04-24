<template>
  <div class="p-4">
    <div class="tabs">
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
    <div class="py-5 pl-2">
      <router-view />
    </div>
  </div>
</template>

<script>
import { BContainer } from 'bootstrap-vue';
import { services } from '@services';
import { mutations, store } from '@store';

export default {
  computed: {},
  data() {
    return {
      wallet: Object,
    };
  },
  mounted() {
    services.auth
      .fetchAccount(this.$route.params.wallet_id)
      .then(({ data, config }) => {
        this.wallet = data.result;
      })
      .catch(err => {});
  },
};
</script>

<style scoped>
.tabs .tab {
  padding-bottom: 5px;
}
</style>
