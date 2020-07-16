<template>
<b-modal :id="modalId" hide-footer hide-header>
  <div class="basic-form modal-body d-flex w-100">
    <!-- ========================Transfer form============================ -->
    <b-col>

      <b-row class="text-center" style="margin-bottom:20px">
        <b-col>

          <b-avatar size="7rem" variant="light" :style="{
            color: 'white',
            backgroundImage: currentWallet.bgImageStyle,
          }" :text="currentWallet.account[0].toUpperCase()" />
        </b-col>
      </b-row>

      <b-row class="text-center" style="margin-bottom:10px;">
        <b-col>
          <h5>{{ currentWallet.account }}</h5>
        </b-col>
      </b-row>

      <b-row class="text-center">
        <b-col>
          <span>
            <b-badge v-if="!vesting" class="badge">Vesting</b-badge>
            <b-badge v-if="!multisig" class="badge">Multisig</b-badge>
          </span>
        </b-col>
      </b-row>
      <b-row style="margin-bottom:20px;" class="text-center">
        <b-col>
          <div class="final-form">
            <ul>
              <li style="font-size: 11px; margin-top:8px">
                <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                  <label style="margin:0;" for="address-save"> &#128204;</label>
                  <span style="border: none ;color: var(--darkbg);margin-left: 10px;">
                    ki14xfag9l002llq8zgqv2az8x8cn9efp08n5z2q6
                  </span>
                  <span style="padding:15px" />
                </div>
              </li>
              <li style="font-size: 11px; margin-top:8px ">
                <div style="display:flex; flex-direction: row; justify-content: center; align-items: center;">
                  <label style="margin:0;" for="address-save">&#128477;</label>
                  <span style="border: none ;color: var(--darkbg);margin-left: 10px; display:block;width:250px;word-wrap:break-word;">
                    kipub1addwnpepq02h2frzn8aqprkw5cmtpjmetjldx0atav5fwmlxeduffu4smh2ashquy4r
                  </span>
                  <span style="padding:15px" />
                </div>
              </li>
            </ul>
          </div>
        </b-col>
      </b-row>
      <b-row class="text-center">
        <b-col>
          <h6>Balances</h6>
        </b-col>
      </b-row>
      <b-row class="text-center">
        <b-col cols="3"/>
        <b-col>
          <div class="final-form">
            <ul class="token-list">
              <li>
                <div>Available</div>
                <div>
                  {{ globalData.kichain.token }}
                  {{ currentWalletBalancesAmount.available }}</div>
              </li>
              <li>
                <div>Delegated</div>
                <div>
                  {{ globalData.kichain.token }}
                  {{ currentWalletBalancesAmount.delegated }}</div>
              </li>
              <li>
                <div>Unbonding</div>
                <div>
                  {{ globalData.kichain.token }}
                  {{ currentWalletBalancesAmount.unbonding }}</div>
              </li>
              <li>
                <div>Locked</div>
                <div>
                  {{ globalData.kichain.token }}
                  {{ currentWalletBalancesAmount.locked }}</div>
              </li>
            </ul>

          </div>
        </b-col>
        <b-col cols="3"/>

      </b-row>
    </b-col>
  </div>
</b-modal>
</template>

<script>
import {
  KeyPair,
  signTx,
  verifyTx,
  createWalletFromMnemonic,
  createBroadcastTx,
} from '@tendermint/sig';
import {
  BRow,
  BCol,
  BContainer,
  BModal,
  BAvatar,
  BTooltip,
  BBadge
} from 'bootstrap-vue';
import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex';

import {
  GET_CURRENT_WALLET_BALANCES_AMOUNT,
  GET_CURRENT_WALLET_BALANCES_DENOM,
  HYDRATE_CURRENT_WALLET,
} from '@store/wallets';

export default {
  components: {
    BRow,
    BCol,
    BAvatar,
    BBadge,
  },
  props: {
    modalId: {
      type: String,
      default: 'info-modal',
    },
  },
  data() {
    return {

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
    multisig() {
      return this.$store.state.wallets.current.multisign;
    },
    vesting() {
      return this.$store.state.wallets.current.vesting;
    },
  },
  mounted() {
    console.log(this.vesting, this.multisig);
  },
  methods: {},
};
</script>

<style scoped></style>
