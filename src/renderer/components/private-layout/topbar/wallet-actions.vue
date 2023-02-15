<template>
  <div class="d-flex w-100 h-100 justify-content-between align-items-center">
    <div class="d-flex flex-row align-items-center">
      <div class="d-flex justify-content-center align-items-center">
        <a v-b-modal="'info-modal'" class="d-flex flex-column align-items-center justify-content-center">
          <b-avatar
            badge-offset="-2px"
            class="d-flex justify-content-center align-items-center"
            size="3.5rem"
            variant="light"
            :style="{
              color: 'white',
              backgroundImage: currentWallet.bgImageStyle,
            }"
            :text="currentWallet.account[0].toUpperCase()"
          >
            <template #badge><div style="color: white; font-weight: 400; font-size: 10px">+</div></template>
          </b-avatar>
        </a>
      </div>
      <div class="d-flex justify-content-center flex-column ml-3">
        <h5>{{ currentWallet.account }}</h5>
        <h6 class="mt-1" style="font-weight: 400; cursor: pointer">
          <span
            id="popover-target-copy"
            v-clipboard:copy="currentWallet.address"
            @click="copy_text = 'Copied'"
          >
            {{ address_truncated }}
          </span>
          <b-popover
            target="popover-target-copy"
            :content="copy_text"
            triggers="hover"
            placement="right"
            @hidden="onHidden"
          >
          </b-popover>
        </h6>
      </div>

      <div class="d-flex mx-5" :style="{ width: '1px', height: '53px', background: '#dee2e6' }"></div>

      <div class="d-flex justify-content-center" :style="{ gap: '3rem' }">
        <Balance
          :loading="loading"
          :amount="total_available"
          :amount-size="'1.05rem'"
          :amount-currency="globalData?.kichain?.denom?.toUpperCase() || ''"
          :dollar-amount="total_usd ?? 0"
          :token-price="token_price ?? 0"
          :token-price-currency="globalData?.kichain?.token || ''"
        />
        
        <Balance
          v-if="total_available_usdc !== '0.00'"
          :loading="loading"
          :amount-size="'1.05rem'"
          :amount="total_available_usdc"
          :amount-currency="'USDC'"
          :dollar-amount="total_available_usdc"
        />
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
          <unicon name="sync" :class="[refreshing ? 'rotating' : '']" :fill="colors.secondary" />
          <span class="mt-2" :style="{ fontWeight: '500' }">Refresh</span>
        </a>
      </div>
      <div class="border-left pl-4">
        <a v-b-modal="'transfer-modal'" class="d-flex flex-column align-items-center justify-content-center">
          <unicon name="exchange" :fill="colors.secondary" />
          <span class="mt-2" :style="{ fontWeight: '500' }">Transfer</span>
        </a>
      </div>
    </div>
    <TransferModal />
    <InfoModal />
    <ErrorModal />
  </div>
</template>

<script lang="ts">
import TransferModal from '@cmp/transfer/modals/index.vue';
import InfoModal from '@cmp/info/modals/index.vue';
import ErrorModal from '@cmp/error/modals/index.vue';
import Balance from '@cmp/balance/balance.vue';
import { BAvatar, BPopover, BTooltip } from 'bootstrap-vue';
import { mapGetters, mapState, mapActions } from 'vuex';
import { truncate } from '@helpers/text';
import {
  GET_CURRENT_WALLET_BALANCES_AMOUNT,
  GET_CURRENT_WALLET_BALANCES_DENOM,
  HYDRATE_CURRENT_WALLET,
  FETCH_WALLET_REWARDS,
} from '@store/wallets';
import { FETCH_VALIDATORS_LIST } from '@store/validators';
import { tokenUtil } from '@helpers/token';
import numeral from 'numeral';

import type { colors } from '@helpers/colors';

export default {
  inject: ['globalData', 'colors'],
  components: {
    TransferModal,
    BAvatar,
    InfoModal,
    ErrorModal,
    BPopover,
    Balance,
    BTooltip,
  },
  data() {
    return {
      tooltipShow: false,
      refreshing: false,
      invalidWallet: false,
      total_usd: 0,
      total_available: 0,
      total_available_usdc: 0,
      show_add: false,
      copy_text: 'Click to copy',
      token_price: 0.0,
      address_truncated: '',
    };
  },
  computed: {
    ...mapGetters({
      currentWalletBalancesAmount: GET_CURRENT_WALLET_BALANCES_AMOUNT,
      currentWalletBalancesDenom: GET_CURRENT_WALLET_BALANCES_DENOM,
    }),
    ...mapState({
      currentWallet: (state) => state.wallets.current,
      loading: (state) => state.wallets.loading,
      token_price_raw: (state) => state.price,
    }),
  },
  mounted() {
    this.invalidWallet = this.currentWallet.invalid;

    if (this.invalidWallet) {
      this.$bvModal.show('error-modal');
    }
    this.total_available = tokenUtil.formatShort(
      numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10, 6)
    );
    this.total_available_usdc = tokenUtil.formatShort(
      numeral(this.currentWalletBalancesAmount.availableUSDC).value() * Math.pow(10, 6)
    );
    this.total_usd = tokenUtil.formatShort(
      numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10, 6) * this.token_price_raw
    );
    this.token_price = tokenUtil.formatPrice(this.token_price_raw);

    this.address_truncated = truncate(this.currentWallet.address, 15);
  },
  methods: {
    ...mapActions({
      hydrateCurrentWallet: HYDRATE_CURRENT_WALLET,
      fetchAllValidators: FETCH_VALIDATORS_LIST,
      fetchWalletRewards: FETCH_WALLET_REWARDS,
    }),
    async handleRefresh() {
      this.refreshing = true;
      await this.hydrateCurrentWallet(this.currentWallet);
      await this.fetchAllValidators();
      await this.fetchWalletRewards();
      this.total_available = tokenUtil.formatShort(
        numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10, 6)
      );
      this.total_usd = tokenUtil.formatShort(
        numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10, 6) * this.token_price_raw
      );
      this.total_available_usdc = tokenUtil.formatShort(
        numeral(this.currentWalletBalancesAmount.availableUSDC).value() * Math.pow(10, 6)
      );
      this.refreshing = false;
    },
    onHidden() {
      this.copy_text = 'Click to copy';
    },
  },
};
</script>

<style scoped>
* {
  color: var(--textColor);
}
.copy {
  opacity: 0.2;
}

.copy:hover {
  opacity: 0.5;
}
</style>
