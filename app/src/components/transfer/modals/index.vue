<template>
  <b-modal
    :id="modalId"
    :title="$t('transfer_modal_title')"
    hide-footer
    @show="onResetModal"
    @shown="progressSlide"
  >
    <div class="basic-form modal-body d-flex w-100">
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
              <label>{{ $t('transfer_amount') }}</label>
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
          <div class="fee-set">
            <label>{{ $t('webwallet_fee') }}</label>
            <label
              v-show="selectedSet == 2"
              class="setBtn"
              @click="setToggle(1)"
              >{{ $t('webwallet_simple') }}</label
            >
            <label
              v-show="selectedSet == 1"
              class="setBtn"
              @click="setToggle(2)"
              >{{ $t('webwallet_advanced') }}</label
            >

            <ul v-if="selectedSet == 1" class="basic-group clearfix">
              <li ref="slider" class="amount slider">
                <div ref="thunk" class="thunk" :style="{ left }">
                  <div class="block">
                    <img src="static/img/icons/slider@2x.png" width="16" />
                  </div>
                </div>
                <div class="cheap">
                  {{ $t('webwallet_cheap') }}
                </div>
                <div class="fast">
                  {{ $t('webwallet_fast') }}
                </div>
              </li>
              <li class="token">
                <div class="input">{{ transfer.fee.toFixed(6) }} TKI</div>
              </li>
            </ul>

            <ul v-else-if="selectedSet == 2" class="basic-group clearfix">
              <li class="gas-price">
                <span>Gas Price (TKI)</span>
                <input
                  v-model="transfer.gasPrice"
                  type="text"
                  placeholder="0"
                />
              </li>
              <li class="gas-limit">
                <span>Gas Limit</span>
                <input
                  v-model="transfer.gasLimit"
                  type="text"
                  placeholder="0"
                />
              </li>
              <li class="token">
                <div class="input">{{ feeCompute.toFixed(6) }} TKI</div>
              </li>
            </ul>
          </div>
          <label>{{ $t('memo') }}</label>
          <input
            v-model="transfer.memo"
            type="text"
            :placeholder="$t('webwallet_memo_pl')"
          />
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

          <li v-if="transfer.output != ''" class="token">
            <label>{{ $t('webwallet_output') }}</label>
            <textarea v-model="transfer.output" class="" rows="3" disabled />
          </li>
          <b-row align-v="center">
            <b-col class="d-flex justify-content-center">
              <a class="btn btn-primary" @click="sendTransfer">
                <span
                  v-if="!multisig"
                  >{{ $t('transfer') }}</span
                >
                <span v-else>Generate</span>
              </a>
            </b-col>
          </b-row>
        </form>
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

export default {
  components: {
    BRow,
    BCol,
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
      unit: this.webCoin.unit,
      slider: null,
      thunk: null,
      progress: {
        per: 50,
        min: 10,
        max: 100,
      },
      transfer: {
        alert: '',
        account: '',
        amount: 0,
        token: 'tki',
        memo: '',
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
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
    multisig() {
      return this.$store.state.app.multisign;
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
        token: 'tki',
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
    sendTransfer() {
      this.transfer.alert = 'danger';
      let filled = true;

      if (!this.transfer.account) {
        filled = false;
      }
      if (!this.transfer.amount) {
        filled = false;
      }
      if (!this.wallet_pass_tmp) {
        filled = false;
      }
      if (this.transfer.amount < Math.pow(10, -6)) {
        filled = false;
      }

      if (!filled) {
        return false;
      }

      let nodeUrl = this.globalData.kichain.nodeUrl;
      let account = this.account.id;

      let fee = this.transfer.fee * Math.pow(10, 6);
      let limit = 300000;

      if (this.selectedSet == 2) {
        fee = this.transfer.gasPrice * this.transfer.gasLimit * Math.pow(10, 6);
        limit = this.transfer.gasLimit;
      }

      const transaction = {
        msg: [
          {
            type: 'cosmos-sdk/MsgSend',
            value: {
              from_address: account,
              to_address: this.transfer.account,
              amount: [
                {
                  denom: 'tki',
                  amount: (this.transfer.amount * Math.pow(10, 6)).toString(),
                },
              ],
            },
          },
        ],
        fee: {
          amount: [
            {
              denom: 'tki',
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
        this.postTx({
          transaction,
          password: this.wallet_pass_tmp,
        });
        this.$bvToast.toast('Transaction sent with success', {
          title: `Transaction success`,
          variant: 'success',
          autoHideDelay: 2000,
          solid: true,
          toaster: 'b-toaster-bottom-center',
        });
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
    progressSlide() {
      this.slider = this.$refs.slider;
      this.thunk = this.$refs.thunk;
      let _this = this;
      this.transfer.fee = 0.015 * (this.progress.per / this.progress.max);
      this.thunk.onmousedown = function(e) {
        let width = parseInt(_this.width);
        let disX = e.clientX;
        document.onmousemove = function(e) {
          let newWidth = e.clientX - disX + width;
          let scale = newWidth / _this.slider.offsetWidth;
          let max = _this.progress.max;
          let min = _this.progress.min;

          _this.progress.per = Math.ceil((max - min) * scale + min);
          _this.progress.per = Math.max(_this.progress.per, min);
          _this.progress.per = Math.min(_this.progress.per, max);
          _this.transfer.fee = 0.015 * (_this.progress.per / max).toFixed(6);
        };
        document.onmouseup = function(e) {
          document.onmousemove = document.onmouseup = null;
        };
        return false;
      };
    },
    setToggle(val) {
      this.selectedSet = val;
    },
  },
};
</script>

<style scoped></style>
