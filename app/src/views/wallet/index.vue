<template>
  <div class="py-4 w-100">
    <div class="tabs w-100 pb-3">
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
    <div class="p-4 w-100 h-100" :style="{ overflow: 'auto' }" v-if="!loading">
      <transition
        name="fade"
        mode="out-in"
        @beforeLeave="beforeLeave"
        @enter="enter"
        @afterEnter="afterEnter"
      >
        <router-view />
      </transition>
    </div>
    <div
      v-else
      class="d-flex h-100 justify-content-center align-items-center"
      :style="{ minHeight: '10em' }"
    >
      <b-spinner variant="primary" label="Spinning" />
    </div>
  </div>
</template>

<script>
import { BContainer, BSpinner } from 'bootstrap-vue';
import { services } from '@services/index';
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
import { HYDRATE_CURRENT_WALLET, START_HYDRATE } from '@store/wallets';
import { HYDRATE_ACCOUNT, SET_ACCOUNT } from '@store/account';

export default {
  components: {
    BSpinner,
  },
  data() {
    return {
      loading: false,
      prevHeight: 0,
    };
  },
  computed: {
    ...mapState({
      currentWallet: state => state.wallets.current,
    }),
  },
  async created() {
    const walletFromLocalStorage =
      localStorage.getItem('current_wallet') &&
      JSON.parse(localStorage.getItem('current_wallet'));
    // Wallet page reloaded
    if (walletFromLocalStorage && !this.currentWallet) {
      this.setWalletLoading();
      this.loading = true;
      this.setAccount({
        id: walletFromLocalStorage.address,
        name: walletFromLocalStorage.account,
      });
      await this.hydrateAccount(walletFromLocalStorage.address);
      await this.hydrateCurrentWallet(walletFromLocalStorage);
      this.loading = false;
    }
  },
  methods: {
    ...mapActions({
      hydrateAccount: HYDRATE_ACCOUNT,
      hydrateCurrentWallet: HYDRATE_CURRENT_WALLET,
    }),
    ...mapMutations({
      setWalletLoading: START_HYDRATE,
      setAccount: SET_ACCOUNT,
    }),
    beforeLeave(element) {
      this.prevHeight = getComputedStyle(element).height;
    },
    enter(element) {
      const { height } = getComputedStyle(element);

      element.style.height = this.prevHeight;

      setTimeout(() => {
        element.style.height = height;
      });
    },
    afterEnter(element) {
      element.style.height = 'auto';
    },
  },
};
</script>

<style scoped>
.tabs .tab {
  padding-bottom: 3px;
}
</style>
