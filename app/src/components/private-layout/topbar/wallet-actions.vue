<template>
<div class="d-flex w-100 h-100 justify-content-between align-items-center">
  <div class="d-flex flex-row">
    <div class="d-flex justify-content-center align-items-center">
      <a v-b-modal="'info-modal'" class="d-flex flex-column align-items-center justify-content-center">
        <b-avatar badge-offset="-2px" class="d-flex justify-content-center align-items-center" size="3.5rem" variant="light" :style="{
            color: 'white',
            backgroundImage: currentWallet.bgImageStyle,
          }" :text="currentWallet.account[0].toUpperCase()" >
          <template #badge><div style="color:white;font-weight:400;font-size:10px">+</div></template>
        </b-avatar>
      </a>
    </div>
    <div class="d-flex justify-content-center flex-column ml-3">
      <h5 >{{ currentWallet.account }}</h5>
        <h6 class="mt-1" style=" display: inline; font-weight:400; cursor: pointer;">
          <span id="popover-target-copy" v-clipboard:copy="currentWallet.address" @click="copy_text='Copied'"> {{ currentWallet.address }} </span>
          <b-popover target="popover-target-copy" triggers="hover" placement="right" @hidden="onHidden">
             {{copy_text}}
           </b-popover>
        </h6>
      <h4 class="mt-1">
        <span :style="{ fontSize:'1.4rem', fontWeight: '800' }">{{ total_available }} </span>
        <span :style="{ fontWeight: '400' }">{{ globalData.kichain.token }}</span>
        <span  :style="{
              color: 'var(--secondary)',
              fontSize: '0.9rem',
              fontWeight: '600'
            }">

          ≈ ${{total_usd}}  (${{ token_price }}/{{ globalData.kichain.token }})
        </span>
      </h4>
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
  BTooltip,
  BPopover
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
    ErrorModal,
    BPopover
  },
  data() {
    return {
      tooltipShow: false,
      refreshing: false,
      invalidWallet: false,
      total_usd:0,
      total_available:0,
      show_add: false,
      copy_text: "Click to copy",
      token_price: 0.00
    };
  },
  computed: {
    ...mapGetters({
      currentWalletBalancesAmount: GET_CURRENT_WALLET_BALANCES_AMOUNT,
      currentWalletBalancesDenom: GET_CURRENT_WALLET_BALANCES_DENOM,
    }),
    ...mapState({
      currentWallet: state => state.wallets.current,
      token_price_raw: state => state.price,
    }),
  },
  mounted() {
    this.invalidWallet = this.currentWallet.invalid

    if (this.invalidWallet) {
      this.$bvModal.show("error-modal")
    }
    this.total_available = tokenUtil.formatShort(numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10,6));
    this.total_usd = tokenUtil.formatShort(numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10,6) * this.token_price_raw);
    this.token_price = tokenUtil.formatPrice(this.token_price_raw);
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
      this.total_available = tokenUtil.formatShort(numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10,6));
      this.total_usd = tokenUtil.formatShort(numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10,6) * this.token_price_raw);
      this.refreshing = false;
    },
    toggleCopiedTooltip() {},
    onHidden(){
      this.copy_text= "Click to copy"
    }
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
