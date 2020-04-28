<template>
  <div class="d-flex w-100 h-100 justify-content-between align-items-center">
    <div class="d-flex flex-row">
      <div class="d-flex justify-content-center align-items-center">
        <b-avatar
          class="d-flex justify-content-center align-items-center"
          size="3.5rem"
          variant="light"
          :style="{ color: 'black' }"
          :text="currentWallet.account[0]"
        />
      </div>
      <div class="d-flex justify-content-center flex-column ml-3">
        <h5>{{ currentWallet.account }}</h5>
        <p
          :style="{
            color: 'royalblue',
            fontSize: '0.85rem',
            fontWeight: '600',
          }"
        >
          {{ currentWallet.address }}
          <!-- <unicon
            name="copy"
            width="16px"
            height="16px"
            id="copy-btn"
            :data-clipboard-text="currentWallet.address"
            class="ml-1"
            fill="royalblue"
            :style="{
              cursor: 'pointer',
              border: '1px solid royalblue',
              borderTopRightRadius: '5px',
              borderBottomRightRadius: '5px',
              padding: '2px',
            }"
          /> -->
        </p>
        <h4 :style="{ fontWeight: 'bolder' }">
          {{ currentWalletBalancesDenom }} {{ currentWalletBalancesAmount }}
        </h4>
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
          <unicon name="sync" fill="royalblue" />
          <span class="mt-2" :style="{ fontWeight: '600', color: 'white' }"
            >Refresh</span
          >
        </a>
      </div>
      <div class="border-left pl-4">
        <a
          role="button"
          data-toggle="modal"
          data-target="#transfer-modal"
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <unicon name="exchange" fill="royalblue" />
          <span class="mt-2" :style="{ fontWeight: '600', color: 'white' }"
            >Transfer</span
          >
        </a>
      </div>
    </div>
    <TransferModal modalId="transfer-modal" />
  </div>
</template>

<script>
import TransferModal from '@cmp/transfer/modals/index';
import { BAvatar, BTooltip } from 'bootstrap-vue';
import { mapGetters, mapState } from 'vuex';
import {
  GET_CURRENT_WALLET_BALANCES_AMOUNT,
  GET_CURRENT_WALLET_BALANCES_DENOM,
} from '@store/wallets';

export default {
  components: {
    TransferModal,
    BAvatar,
  },
  data() {
    return {
      tooltipShow: false,
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
    handleRefresh() {
      alert('To Implement');
    },
    toggleCopiedTooltip() {},
  },
};
</script>

<style scoped>
* {
  color: white;
}
</style>
