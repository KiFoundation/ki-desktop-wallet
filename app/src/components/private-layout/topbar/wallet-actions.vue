<template>
  <div class="d-flex w-100 h-100 justify-content-between align-items-center">
    <div class="d-flex flex-row">
      <div class="d-flex justify-content-center align-items-center">
        <b-avatar
          class="d-flex justify-content-center align-items-center"
          size="3.5rem"
          variant="light"
          :style="{
            color: 'white',
            backgroundImage: currentWallet.bgImageStyle,
          }"
          :text="currentWallet.account[0].toUpperCase()"
        />
      </div>
      <div class="d-flex justify-content-center flex-column ml-3">
        <h5>{{ currentWallet.account }}</h5>
        <p
          :style="{
            color: 'var(--secondary)',
            fontSize: '0.85rem',
            fontWeight: '600',
          }"
        >
          {{ currentWallet.address }}
        </p>
        <h5 :style="{ fontWeight: 'bolder' }">
          {{ currentWalletBalancesDenom }}
          {{ currentWalletBalancesAmount }}
        </h5>
      </div>
    </div>
    <div class="d-flex flex-row">
      <div class="pr-4">
        <a
          role="button"
          data-toggle="modal"
          data-target="#add-form-topbar"
          class="d-flex flex-column align-items-center justify-content-center"
          @click="handleRefresh"
        >
          <unicon
            name="sync"
            :class="[refreshing ? 'rotating' : '']"
            :fill="colors.secondary"
          />
          <span class="mt-2" :style="{ fontWeight: '500' }">Refresh</span>
        </a>
      </div>
      <div class="border-left pl-4">
        <a
          v-b-modal="'transfer-modal'"
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <unicon name="exchange" :fill="colors.secondary" />
          <span class="mt-2" :style="{ fontWeight: '500' }">Transfer</span>
        </a>
      </div>
    </div>
    <TransferModal />
  </div>
</template>

<script>
import TransferModal from '@cmp/transfer/modals/index';
import { BAvatar, BTooltip } from 'bootstrap-vue';
import { mapGetters, mapState, mapActions } from 'vuex';
import {
  GET_CURRENT_WALLET_BALANCES_AMOUNT,
  GET_CURRENT_WALLET_BALANCES_DENOM,
  HYDRATE_CURRENT_WALLET,
} from '@store/wallets';
import { FETCH_VALIDATORS_LIST } from '@store/validators';

export default {
  components: {
    TransferModal,
    BAvatar,
  },
  data() {
    return {
      tooltipShow: false,
      refreshing: false,
    };
  },
  computed: {
    ...mapGetters({
      currentWalletBalancesAmount: GET_CURRENT_WALLET_BALANCES_AMOUNT,
      currentWalletBalancesDenom: GET_CURRENT_WALLET_BALANCES_DENOM,
    }),
    ...mapState({
      currentWallet: state => state.wallets.current,
    }),
  },
  mounted() {
    // const clipboard = new this.clipboard('#copy-btn');
  },
  methods: {
    ...mapActions({
      hydrateCurrentWallet: HYDRATE_CURRENT_WALLET,
      fetchAllValidators: FETCH_VALIDATORS_LIST,
    }),
    async handleRefresh() {
      this.refreshing = true;
      await this.hydrateCurrentWallet(this.currentWallet);
      await this.fetchAllValidators();
      this.refreshing = false;
    },
    toggleCopiedTooltip() {},
  },
};
</script>

<style scoped>
* {
  color: var(--textColor);
}
</style>
