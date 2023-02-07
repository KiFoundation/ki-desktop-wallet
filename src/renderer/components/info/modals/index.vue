<template>
  <b-modal :id="modalId" hide-footer hide-header :size="'lg'">
    <div class="basic-form modal-body d-flex w-100" :style="{ width: 750 }">
      <!-- ========================Transfer form============================ -->
      <b-col cols="6">
        <b-row class="text-center" style="margin-bottom: 20px; margin-top: 40px">
          <b-col>
            <!-- <b-avatar size="7rem" variant="light" :style="{
            color: 'white',
            backgroundImage: currentWallet.bgImageStyle,
          }" :text="currentWallet.account[0].toUpperCase()" /> -->
            <qrcode-vue :value="currentWallet.address" :size="120" level="H" />
          </b-col>
        </b-row>

        <b-row class="text-center" style="margin-bottom: 10px">
          <b-col>
            <h5>{{ currentWallet.account }}</h5>
          </b-col>
        </b-row>

        <b-row class="text-center" style="margin-bottom: 20px">
          <b-col>
            <span>
              <b-badge v-if="vesting" class="badge">Vesting</b-badge>
              <b-badge v-if="multisig" class="badge">Multisig</b-badge>
              <b-badge v-if="offline" class="badge badge-delegate">Offline</b-badge>
            </span>
          </b-col>
        </b-row>
        <b-row style="margin-bottom: 10px" class="text-center">
          <b-col>
            <div class="final-form">
              <ul>
                <li style="font-size: 12px; margin-top: 8px">
                  <p
                    :style="{
                      /* color: 'var(--secondary)', */
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }"
                  >
                    Address
                  </p>
                  <div
                    style="display: flex; flex-direction: row; justify-content: center; align-items: center"
                  >
                    <span
                      style="
                        border: none;
                        color: var(--darkbg);
                        display: block;
                        width: 180px;
                        word-wrap: break-word;
                      "
                    >
                      {{ currentWallet.address }}
                    </span>
                  </div>
                </li>
                <li style="font-size: 12px; margin-top: 8px">
                  <p
                    :style="{
                      /* color: 'var(--secondary)', */
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }"
                    v-if="!multisig"
                  >
                    Public Key
                  </p>
                  <p
                    :style="{
                      /* color: 'var(--secondary)', */
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }"
                    v-if="multisig"
                  >
                    Description
                  </p>
                  <div
                    style="display: flex; flex-direction: row; justify-content: center; align-items: center"
                  >
                    <span
                      style="
                        border: none;
                        color: var(--darkbg);
                        display: block;
                        width: 180px;
                        word-wrap: break-word;
                      "
                      v-if="!multisig"
                    >
                      {{ publickeyBech32 }}
                    </span>
                    <span
                      style="
                        border: none;
                        color: var(--darkbg);
                        display: block;
                        width: 180px;
                        word-wrap: break-word;
                      "
                      v-else
                    >
                      {{ currentWallet.multisign_data.description }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </b-col>
        </b-row>
      </b-col>

      <b-col cols="6" style="margin-top: 0px">
        <b-row class="text-center">
          <b-col cols="12" class="pl-1 pr-1">
            <div
              class="d-flex justify-content-center flex-column"
              style="height: 80px; border-bottom: 1px solid var(--pale-grey)"
            >
              <div class="d-flex justify-content-around">
                <div>
                  <p
                    :style="{
                      color: 'var(--secondary)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }"
                  >
                    Available
                  </p>
                  <h6 :style="{ fontWeight: 'bolder' }">
                    {{ currentWalletBalancesAmount.available }}
                    {{ currencySymbol }}
                  </h6>
                  <p
                    :style="{
                      color: 'var(--secondary)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }"
                  >
                    ≈ ${{ balancesUSD.available }}
                  </p>
                </div>
                <div>
                  <p
                    :style="{
                      color: 'var(--secondary)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }"
                  >
                    Available USDC
                  </p>
                  <h6 :style="{ fontWeight: 'bolder' }">
                    {{ currentWalletBalancesAmount.availableUSDC }} USDC
                  </h6>
                  <p
                    :style="{
                      color: 'var(--secondary)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }"
                  >
                    ≈ ${{ currentWalletBalancesAmount.availableUSDC }}
                  </p>
                </div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" class="pl-1 pr-1">
            <div
              class="d-flex justify-content-center flex-column"
              style="height: 80px; border-bottom: 1px solid var(--pale-grey)"
            >
              <p
                :style="{
                  color: 'var(--secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
              >
                Delegated
              </p>
              <h6 :style="{ fontWeight: 'bolder' }">
                {{ currentWalletBalancesAmount.delegated }}
                {{ currencySymbol }}
              </h6>
              <p
                :style="{
                  color: 'var(--secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
              >
                ≈ ${{ balancesUSD.delegated }}
              </p>
            </div>
          </b-col>
          <b-col cols="12" class="pl-1 pr-1">
            <div
              class="d-flex justify-content-center flex-column"
              style="height: 80px; border-bottom: 1px solid var(--pale-grey)"
            >
              <p
                :style="{
                  color: 'var(--secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
              >
                Unbonding
              </p>
              <h6 :style="{ fontWeight: 'bolder' }">
                {{ currentWalletBalancesAmount.unbonding }}
                {{ currencySymbol }}
              </h6>
              <p
                :style="{
                  color: 'var(--secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
              >
                ≈ ${{ this.balancesUSD.unbonding }}
              </p>
            </div>
          </b-col>
          <b-col cols="12" class="pl-1 pr-1">
            <div
              class="d-flex justify-content-center flex-column"
              style="height: 80px; border-bottom: 1px solid var(--pale-grey)"
            >
              <p
                :style="{
                  color: 'var(--secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
              >
                Locked
              </p>
              <h6 :style="{ fontWeight: 'bolder' }">
                {{ currentWalletBalancesAmount.locked }}
                {{ currencySymbol }}
              </h6>
              <p
                :style="{
                  color: 'var(--secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
              >
                ≈ ${{ this.balancesUSD.locked }}
              </p>
            </div>
          </b-col>
          <b-col cols="12" class="pl-1 pr-1">
            <div class="d-flex justify-content-center flex-column" style="height: 80px">
              <p
                :style="{
                  color: 'var(--secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
              >
                Total
              </p>
              <h6 :style="{ fontWeight: 'bolder' }">
                {{ currentWalletBalancesAmount.total }}
                {{ currencySymbol }}
              </h6>
              <p
                :style="{
                  color: 'var(--secondary)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
              >
                ≈ ${{ this.balancesUSD.total }}
              </p>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </div>
  </b-modal>
</template>

<script lang="ts">
import { BRow, BCol, BModal, BBadge } from 'bootstrap-vue';
import { mapState, mapGetters } from 'vuex';
import bech32 from 'bech32';

import { GET_CURRENT_WALLET_BALANCES_AMOUNT, GET_CURRENT_WALLET_BALANCES_DENOM } from '@store/wallets';
import { tokenUtil } from '@helpers/token';
import numeral from 'numeral';
import QrcodeVue from 'qrcode.vue';

export default {
  inject: ['globalData'],
  components: {
    BRow,
    BCol,
    // BAvatar,
    BBadge,
    QrcodeVue,
  },
  props: {
    modalId: {
      type: String,
      default: 'info-modal',
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      currentWalletBalancesAmount: GET_CURRENT_WALLET_BALANCES_AMOUNT,
      currentWalletBalancesDenom: GET_CURRENT_WALLET_BALANCES_DENOM,
    }),
    ...mapState({
      currentWallet: (state) => state.wallets.current,
      token_price: (state) => state.price,
    }),
    currencySymbol() {
      return this.globalData?.kichain?.denom?.toUpperCase() || '';
    },
    balancesUSD() {
      return {
        available: tokenUtil.formatShort(
          numeral(this.currentWalletBalancesAmount.available).value() * Math.pow(10, 6) * this.token_price
        ),
        availableUSDC: tokenUtil.formatShort(
          numeral(this.currentWalletBalancesAmount.availableUSDC).value() * Math.pow(10, 6) * this.token_price
        ),
        delegated: tokenUtil.formatShort(
          numeral(this.currentWalletBalancesAmount.delegated).value() * Math.pow(10, 6) * this.token_price
        ),
        unbonding: tokenUtil.formatShort(
          numeral(this.currentWalletBalancesAmount.unbonding).value() * Math.pow(10, 6) * this.token_price
        ),
        locked: tokenUtil.formatShort(
          numeral(this.currentWalletBalancesAmount.locked).value() * Math.pow(10, 6) * this.token_price
        ),
        total: tokenUtil.formatShort(
          numeral(this.currentWalletBalancesAmount.total).value() * Math.pow(10, 6) * this.token_price
        ),
      };
    },
    multisig() {
      return this.$store.state.wallets.current.multisign;
    },
    vesting() {
      return this.$store.state.wallets.current.vesting;
    },
    offline() {
      return this.$store.state.wallets.current.offline;
    },
    publickeyBech32() {
      let pubkeyAminoPrefix = Buffer.from('eb5ae98721', 'hex');
      let buffer = Buffer.alloc(38);
      pubkeyAminoPrefix.copy(buffer, 0);
      Buffer.from(this.currentWallet.publickey, 'hex').copy(buffer, pubkeyAminoPrefix.length);
      return bech32.encode('kipub', bech32.toWords(buffer));
    },
  },
  methods: {},
};
</script>

<style scoped></style>
