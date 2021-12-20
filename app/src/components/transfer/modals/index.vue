<template>
  <b-modal
    :id="modalId"
    hide-footer
    @show="onResetModal"
  >
  <div class="basic-form modal-body">
    <div class="modal-header" >
      <h5 class="modal-title">
        {{
          $t('transfer_modal_title')
        }}
      </h5>
    </div>
    <div class="basic-form d-flex w-100">

      <!-- ========================Transfer form============================ -->
      <div id="transfer-form" class="tab-pane in active w-100">
        <form class="basic-form">
          <label class="mt-0">{{ $t('webwallet_to_address') }}</label>
          <input
            v-model="transfer.account"
            type="text"
            :placeholder="$t('webwallet_to_address_pl')"
            :class="[transfer.account ? '' : transfer.alert]"
            list="self_wallets"
          />
          <datalist id="self_wallets">
            <option
              v-for="item in wallets"
              :key="item.address"
              :value="item.address"
            >
              {{ item.account }}
            </option>
          </datalist>
          <ul class="basic-group clearfix">
            <li class="amount">
              <div>
                <label>{{ $t('transfer_amount') }}</label>
                <div class="all" >
                  <a class="all-link" @click="setTokens(1)"> Half </a> ·
                  <a class="all-link" @click="setTokens(0)"> All </a>
                </div>
              </div>
              <input
                v-model="transfer.amount"
                type="text"
                placeholder="0"
                :class="[transfer.amount ? '' : transfer.alert]"
              />
            </li>
            <li class="token">
              <label>Token</label>
              <input
                v-model="transfer.token"
                type="text"
                placeholder="0"
                disabled
              />
            </li>
          </ul>
          <ul class="basic-group clearfix">
            <FeesInput v-model="fees" />
          </ul>
          <label>{{ $t('memo') }}</label>
          <input
            v-model="transfer.memo"
            type="text"
            :placeholder="$t('webwallet_memo_pl')"
          />
          <div v-if="!multisig">
            <label>{{ $t('enter_password') }}</label>
            <div class="buttonInside">
              <input
                v-model="wallet_pass_tmp"
                :type="password"
                :class="[wallet_pass_tmp ? '' : transfer.alert]"
              />
              <a
                v-if="password == 'password'"
                class="inside"
                @click="password = 'text'"
                ><img
                  src="static/img/icons/eye-on.png"
                  style="width:25px; opacity:0.2"
              /></a>

              <a
                v-if="password == 'text'"
                class="inside"
                @click="password = 'password'"
                ><img
                  src="static/img/icons/eye-off.png"
                  style="width:25px; opacity:0.2"
              /></a>
            </div>
          </div>

          <li v-if="transfer.output != ''" class="token">
            <label>{{ $t('webwallet_output') }}</label>
            <textarea v-model="transfer.output" class="" rows="3" disabled />
          </li>
          <b-row align-v="center">
            <b-col class="d-flex justify-content-center">
              <span v-if="!multisig" >
                <a class="btn btn-primary" @click="sendTransfer">
                  {{ $t('transfer') }}
                </a>
              </span>
              <span v-else >
                <a v-if="transfer.output==''" class="btn btn-primary" @click="sendTransfer">
                  Generate
                </a>
                <a v-else class="btn btn-download"
                @click="download()">
                  Download
                </a>
              </span>


            </b-col>
          </b-row>
        </form>
      </div>
    </div>
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
import { BRow, BCol, BContainer, BModal } from 'bootstrap-vue';
import { mapState, mapActions } from 'vuex';
import { POST_TX } from '@store/tx';
import FeesInput from '@cmp/tx/fees.input';
import util from '@static/js/util';

export default {
  components: {
    BRow,
    BCol,
    FeesInput,
  },
  props: {
    modalId: {
      type: String,
      default: 'transfer-modal',
    },
  },
  data() {
    return {
      selectedSet: 1,
      explorer: this.globalData.explorer,
      udenom: this.globalData.kichain.udenom,
      unit: this.webCoin.unit,
      slider: null,
      thunk: null,
      transfer: {
        alert: '',
        account: '',
        amount: 0,
        token: this.globalData.kichain.token,
        memo: '',
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
      },
      fees: {
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        advanced: false,
      },
      password: 'password',
      wallet_pass_tmp: '',
    };
  },
  computed: {
    ...mapState({
      wallets: state => state.wallets.list,
      account: state => state.account,
    }),

    currentWallet() {
      return this.$store.state.wallets.current;
    },
    multisig() {
      return this.$store.state.wallets.current.multisign;
    },
    // slider stuff
    scale() {
      return (
        (this.progress.per - this.progress.min) /
        (this.progress.max - this.progress.min)
      );
    },
    width() {
      if (this.slider) {
        return this.slider.offsetWidth * this.scale + 'px';
      } else {
        return 0 + 'px';
      }
    },
    left() {
      if (this.slider) {
        var left =
          this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2;

        if (left <= 0) {
          left = 0;
        } else if (left >= this.slider.offsetWidth - this.thunk.offsetWidth) {
          left = this.slider.offsetWidth - this.thunk.offsetWidth;
        }
        return left + 'px';
      } else {
        return '0px';
      }
    },
    feeCompute() {
      return this.transfer.gasPrice * this.transfer.gasLimit;
    },
  },
  mounted() {},
  methods: {
    ...mapActions({
      postTx: POST_TX,
    }),
    onResetModal() {
      this.selectedSet = 1;
      this.slider = null;
      this.thunk = null;
      this.progress = {
        per: 50,
        min: 10,
        max: 100,
      };
      this.transfer = {
        alert: '',
        account: '',
        amount: 0,
        token: this.globalData.kichain.token,
        memo: '',
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
      };
      (this.wallet_pass_tmp = ''), (this.password = 'password');
      this.$emit('onResetModal');
    },
    // Make transfer
    async sendTransfer() {
      this.transfer.alert = 'danger';
      let filled = true;

      if (!this.transfer.account) {
        filled = false;
      }
      if (!this.transfer.amount) {
        filled = false;
      }
      if (!this.wallet_pass_tmp && !this.multisig) {
        filled = false;
      }
      if (this.transfer.amount < Math.pow(10, -6)) {
        filled = false;
      }

      if (!filled) {
        return false;
      }

      let account = this.account.id;

      // Fees stuff
      let fee = this.fees.fee * Math.pow(10, 6);
      let limit = 300000;

      if (this.fees.advanced) {
        fee = this.fees.gasPrice * this.fees.gasLimit * Math.pow(10, 6);
        limit = this.fees.gasLimit;
      }
      //

      const transaction = {
        msg: [
          {
            type: 'cosmos-sdk/MsgSend',
            value: {
              from_address: account,
              to_address: this.transfer.account.trim(),
              amount: [
                {
                  denom: this.udenom,
                  amount: Math.round(this.transfer.amount * Math.pow(10, 6)).toString(),
                },
              ],
            },
          },
        ],
        fee: {
          amount: [
            {
              denom: this.udenom,
              amount: fee.toString(),
            },
          ],
          gas: limit.toString(),
        },
        memo: this.transfer.memo,
      };

      if (this.multisig) {
        this.transfer.output =
          '{ "type": "cosmos-sdk/StdTx", "value":' +
          JSON.stringify(transaction) +
          '}';
      }
      else {
        try {
        let res = await this.postTx({
          transaction,
          password: this.wallet_pass_tmp,
        });

        const $txhashlink = this.$createElement(
          'a',
          {
            attrs: {
                href:  this.explorer + "transactions/" + res.data.txhash,
                target: "_blank"
              }
          },
           res.data.txhash.slice(0, 30) + "..."
        )

        this.$bvToast.toast([$txhashlink] , {
          title: `Transaction success`,
          variant: 'success',
          autoHideDelay: 5000,
          solid: true,
          toaster: 'b-toaster-bottom-center',
        });
        this.handleTransferSuccess()
        this.$emit('onTransferSuccess');
      } catch (error) {
        this.$bvToast.toast(error, {
          title: `Transaction failed`,
          variant: 'danger',
          autoHideDelay: 2000,
          solid: true,
          toaster: 'b-toaster-bottom-center',
        });
        this.$emit('onTransferError');
      }
      }
    },
    setToggle(val) {
      this.selectedSet = val;
    },

    async handleTransferSuccess() {
        this.$bvModal.hide('transfer-modal');
    },

    setTokens(flag){

        var available_tokens = parseFloat(this.currentWallet.balances.available.replace(/,/g, ""))

        if (flag == 0){ //all
          this.transfer.amount = available_tokens -1 > 0 ? available_tokens -1 : 0
        }

        if (flag == 1){ //half
          this.transfer.amount = available_tokens > 1 ? Number(Math.round(available_tokens / 2 + 'e6') + 'e-6') : 0
        }
    },
    download() {
      var date_today = util.getFormatedDate()
      return util.download( date_today + '_transfer_' + this.transfer.amount + 'xki' + '.json', document, this.transfer.output);
    },
  },
};
</script>

<style scoped></style>
