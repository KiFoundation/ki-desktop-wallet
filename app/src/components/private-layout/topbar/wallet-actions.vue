<template>
<div class="d-flex w-100 h-100 justify-content-between align-items-center">
  <div class="d-flex flex-row">
    <div class="d-flex justify-content-center align-items-center">
      <a v-b-modal="'info-modal'" class="d-flex flex-column align-items-center justify-content-center">
        <b-avatar class="d-flex justify-content-center align-items-center" size="3.5rem" variant="light" :style="{
            color: 'white',
            backgroundImage: currentWallet.bgImageStyle,
          }" :text="currentWallet.account[0].toUpperCase()" />
      </a>

    </div>
    <div class="d-flex justify-content-center flex-column ml-3">
      <a v-if="!show_add" @click="show_add=!show_add">
      <h5 >{{ currentWallet.account }}</h5>
    </a>
      <div v-else>
        <a  @click="show_add=!show_add">
        <h6 style=" display: inline;">
          {{ currentWallet.address }}
        </h6>
      </a>
      <img type="button" v-clipboard:copy="currentWallet.address" src="static/img/icons/copy.png" width="15px" class="copy" />

      </div>
      <h4>
        <span  :style="{ fontWeight: '800' }">{{ total_available }} </span>
        <span :style="{ fontWeight: '400' }">{{ globalData.kichain.token }}</span>
      </h4>
      <p :style="{
            color: 'var(--secondary)',
            fontSize: '0.9rem',
            fontWeight: '600',
          }">

        ≈ ${{total_usd}}  (${{ token_price }}/{{ globalData.kichain.token }})
      </p>
    </div>
  </div>


  <div class="d-flex flex-row">
    <div class="pr-4">
      <a role="button" data-toggle="modal" data-target="#add-form-topbar" class="d-flex flex-column align-items-center justify-content-center" @click="handleRefresh">
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

<script>
import TransferModal from '@cmp/transfer/modals/index';
import InfoModal from '@cmp/info/modals/index';
import ErrorModal from '@cmp/error/modals/index';
import {
  BAvatar,
  BTooltip
} from 'bootstrap-vue';
import {
  mapGetters,
  mapState,
  mapActions
} from 'vuex';
import {
  GET_CURRENT_WALLET_BALANCES_AMOUNT,
  GET_CURRENT_WALLET_BALANCES_DENOM,
  HYDRATE_CURRENT_WALLET,
  FETCH_WALLET_REWARDS
} from '@store/wallets';
import {
  FETCH_VALIDATORS_LIST
} from '@store/validators';
import { tokenUtil } from '@static/js/token';
import * as numeral from 'numeral';

export default {
  components: {
    TransferModal,
    BAvatar,
    InfoModal,
    ErrorModal
  },
  data() {
    return {
      tooltipShow: false,
      refreshing: false,
      invalidWallet: false,
      total_usd:0,
      total_available:0,
      show_add: false
    };
  },
  computed: {
    ...mapGetters({
      currentWalletBalancesAmount: GET_CURRENT_WALLET_BALANCES_AMOUNT,
      currentWalletBalancesDenom: GET_CURRENT_WALLET_BALANCES_DENOM,
    }),
    ...mapState({
      currentWallet: state => state.wallets.current,
      token_price: state => state.price,
    }),
  },
  mounted() {
    this.invalidWallet = this.currentWallet.invalid

    if (this.invalidWallet) {
      this.$bvModal.show("error-modal")
    }
    this.total_available = tokenUtil.formatShort(numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10,6));
    this.total_usd = tokenUtil.formatShort(numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10,6) * this.token_price);
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
.copy {
  opacity: 0.2
}

.copy:hover {
  opacity: 0.5
}
</style>
