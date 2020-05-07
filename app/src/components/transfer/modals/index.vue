<template>
  <b-modal
    :id="modalId"
    :title="$t('transfer_modal_title')"
    hide-footer
    @show="onResetModal"
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
          <ul class="basic-group clearfix">
            <FeesInput v-model="fees" />
          </ul>
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
                  v-if="context == 'Broadcast' || (!advanced && !multisig)"
                  >{{ $t('transfer') }}</span
                >
                <span v-else>{{ context }}</span>
              </a>
            </b-col>
            <b-col v-if="advanced" cols="2">
              <select v-model="context" style="margin-top:32px">
                <option key="Broadcast" value="Broadcast" selected>
                  Broadcast
                </option>
                <option key="Sign" value="Sign">
                  Sign
                </option>
                <option key="Generate" value="Generate">
                  Generate
                </option>
              </select>
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
import FeesInput from '@cmp/tx/fees.input';

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
      multisig: false,
      advanced: false,
      context: 'Broadcast',
      explorer: this.globalData.explorer,
      unit: this.webCoin.unit,
      slider: null,
      thunk: null,
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

      if (this.context == 'Generate') {
        this.transfer.output =
          '{ "type": "cosmos-sdk/StdTx", "value":' +
          JSON.stringify(transaction) +
          '}';
      }

      if (this.context == 'Sign') {
        this.transfer.output = JSON.stringify(signedTransactionme);
      }

      if (this.context == 'Broadcast') {
        this.postTx({
          transaction,
          password: this.wallet_pass_tmp,
        });
      }
    },
    setToggle(val) {
      this.selectedSet = val;
    },
  },
};
</script>

<style scoped></style>
