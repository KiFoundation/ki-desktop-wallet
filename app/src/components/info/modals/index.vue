<template>
<b-modal :id="modalId" hide-footer hide-header>
  <div class="basic-form modal-body d-flex w-100">
    <!-- ========================Transfer form============================ -->
    <b-col cols="7">

      <b-row class="text-center" style="margin-bottom:20px; margin-top:10px">
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

      <b-row class="text-center" style="margin-bottom:20px;">
        <b-col>
          <span>
            <b-badge v-if="vesting" class="badge">Vesting</b-badge>
            <b-badge v-if="multisig" class="badge">Multisig</b-badge>
            <b-badge v-if="offline" class="badge badge-delegate">Offline</b-badge>
          </span>
        </b-col>
      </b-row>
      <b-row style="margin-bottom:10px;" class="text-center">
        <b-col>
          <div class="final-form">
            <ul>
              <li style="font-size: 12px; margin-top:8px">
                <p :style="{
                  /* color: 'var(--secondary)', */
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }">
                  Address
                </p>
                <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                  <span style="border: none ;color: var(--darkbg);display:block;width: 180px;  word-wrap:break-word;">
                    {{ currentWallet.address }}
                  </span>
                </div>
              </li>
              <li style="font-size: 12px; margin-top:8px ">
                <p :style="{
                  /* color: 'var(--secondary)', */
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
                 v-if="!multisig">
                 Public Key
                </p>
                <p :style="{
                  /* color: 'var(--secondary)', */
                  fontSize: '0.85rem',
                  fontWeight: '600',
                }"
                 v-if="multisig">
                 Description
                </p>
                <div style="display:flex; flex-direction: row; justify-content: center; align-items: center;" >
                  <span style="border: none ;color: var(--darkbg); display:block; width: 180px;  word-wrap:break-word;"
                    v-if="!multisig">
                    {{ publickeyBech32 }}
                  </span>
                  <span style="border: none ;color: var(--darkbg); display:block; width: 180px;  word-wrap:break-word;"
                    v-else>
                    {{ currentWallet.multisign_data.description }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </b-col>
      </b-row>
    </b-col>

    <b-col cols="5" style="margin-top:20px">
      <b-row class="text-center">
        <b-col cols="12" class="pl-1 pr-1">
          <div class="d-flex justify-content-center flex-column" style="height:80px; border-bottom: 1px solid var(--pale-grey);">
            <h6 :style="{ fontWeight: 'bolder' }">
              {{ globalData.kichain.token }}
              {{ currentWalletBalancesAmount.available }}
            </h6>
            <p :style="{
              color: 'var(--secondary)',
              fontSize: '0.85rem',
              fontWeight: '600',
            }">
              Available
            </p>
          </div>
        </b-col>
        <b-col cols="12" class="pl-1 pr-1">
          <div class="d-flex justify-content-center flex-column" style="height:80px; border-bottom: 1px solid var(--pale-grey);">
            <h6 :style="{ fontWeight: 'bolder' }">
              {{ globalData.kichain.token }}
              {{ currentWalletBalancesAmount.delegated }}
            </h6>
            <p :style="{
              color: 'var(--secondary)',
              fontSize: '0.85rem',
              fontWeight: '600',
            }">
              Delegated
            </p>
          </div>
        </b-col>
        <b-col cols="12" class="pl-1 pr-1">
          <div class="d-flex justify-content-center flex-column" style="height:80px;border-bottom: 1px solid var(--pale-grey);">
            <h6 :style="{ fontWeight: 'bolder' }">
              {{ globalData.kichain.token }}
              {{ currentWalletBalancesAmount.unbonding }}
            </h6>
            <p :style="{
              color: 'var(--secondary)',
              fontSize: '0.85rem',
              fontWeight: '600',
            }">
              Unbonding
            </p>
          </div>
        </b-col>
        <b-col cols="12" class="pl-1 pr-1">
          <div class="d-flex justify-content-center flex-column" style="height:80px; border-bottom: 1px solid var(--pale-grey);">
            <h6 :style="{ fontWeight: 'bolder' }">
              {{ globalData.kichain.token }}
              {{ currentWalletBalancesAmount.locked }}
            </h6>
            <p :style="{
              color: 'var(--secondary)',
              fontSize: '0.85rem',
              fontWeight: '600',
            }">
              Locked
            </p>
          </div>
        </b-col>
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
    offline() {
      return this.$store.state.wallets.current.offline;
    },
    publickeyBech32() {
      const bech32 = require('bech32')
      let pubkeyAminoPrefix = Buffer.from('eb5ae98721', 'hex')
      let buffer = Buffer.alloc(38)
      pubkeyAminoPrefix.copy(buffer, 0)
      Buffer.from(this.currentWallet.publickey, 'hex').copy(buffer, pubkeyAminoPrefix.length)
      return bech32.encode('kipub', bech32.toWords(buffer))
    },

  },
  methods: {
  },
};
</script>

<style scoped></style>
