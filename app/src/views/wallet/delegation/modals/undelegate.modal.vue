<template>
  <b-modal :id="modalId" tabindex="-1" hide-footer @show="resetData">
    <div class="basic-form modal-body">
      <div class="modal-header" >
        <h5 class="modal-title">
          Undelegate from
          <strong :style="{ fontWeight: '600' }">{{
            validator.description.moniker
          }}</strong>
        </h5>
      </div>
      <form class="basic-form">
        <li class="token">
          <div class="d-flex justify-content-start align-items-center">
            <b-badge variant="light" class="ml-0" :style="{ fontSize: '14px' }">
              {{ undelegate.validator }}
            </b-badge>
          </div>
        </li>
        <ul class="basic-group clearfix">
          <li class="amount">
            <div>
              <label>{{ $t('undelegation_amount') }}</label>
              <div class="all" >
                <a class="all-link" @click="setTokens(1)"> Half </a> ·
                <a class="all-link" @click="setTokens(0)"> All </a>
              </div>
            </div>
            <input
              v-model="undelegate.amount"
              type="text"
              placeholder="0"
              :class="[undelegate.amount ? '' : undelegate.alert]"
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
        <div v-if="!multisig">
          <label>{{ $t('enter_password') }}</label>
          <div class="buttonInside">
            <input
              v-model="wallet_pass_tmp"
              :type="password"
              :class="[wallet_pass_tmp ? '' : undelegate.alert]"
            />
            <a
              v-if="password == 'password'"
              class="inside"
              @click="password = 'text'"
            >
              <img
                src="static/img/icons/eye-on.png"
                style="width:25px; opacity:0.2"
              />
            </a>
            <a
              v-if="password == 'text'"
              class="inside"
              @click="password = 'password'"
            >
              <img
                src="static/img/icons/eye-off.png"
                style="width:25px; opacity:0.2"
              />
            </a>
          </div>
        </div>

        <li v-if="undelegate.output != ''" class="token">
          <label>{{ $t('webwallet_output') }}</label>
          <textarea v-model="undelegate.output" class="" rows="3" disabled />
        </li>
        <div><b-alert show style="margin-top:10px" variant="warning">{{ $t('undelegation_warning') }} <a href="https://medium.com/ki-foundation/a-guide-to-staking-on-the-kichain-3d69a71b50e9" target="_blank"> Learn more</a>.</b-alert></div>

        <b-row align-v="center" align-h="center">
          <b-col class="text-center">
            <div v-if="!tx.loading">

            <span v-if="!multisig" >
              <a class="btn btn-primary" @click="sendUnDelegateTx">
                {{ $t('undelegatetx') }}
              </a>
            </span>
            <span v-else >
              <a v-if="undelegate.output==''" class="btn btn-primary" @click="sendUnDelegateTx">
                Generate
              </a>
              <a v-else class="btn btn-download"
              @click="download()">
                Download
              </a>
            </span>
          </div>

            <div v-else>
              <b-spinner small label="Small Spinner" />
            </div>
          </b-col>
        </b-row>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { BRow, BCol, BSpinner, BModal, BBadge, BAlert } from 'bootstrap-vue';
import * as numeral from 'numeral';
import { mapActions } from 'vuex';
import { POST_TX } from '@store/tx';
import { tokenUtil } from '@static/js/token';
import FeesInput from '@cmp/tx/fees.input';
import util from '@static/js/util';

export default {
  components: {
    BRow,
    BCol,
    BSpinner,
    BModal,
    FeesInput,
    BBadge,
    BAlert
  },
  props: {
    modalId: {
      type: String,
      default: 'undelegate-modal',
    },
    validator: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      explorer: this.globalData.explorer,
      udenom: this.globalData.kichain.udenom,
      undelegate: {
        alert: '',
        validator: this.validator.operator_address,
        amount: 0,
        token: this.globalData.kichain.token,
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
      },
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
    currentWallet() {
      return this.$store.state.wallets.current;
    },
    advanced() {
      return this.$store.state.app.advanced;
    },
    multisig() {
      return this.$store.state.wallets.current.multisign;
    },
    account() {
      return this.$store.state.account;
    },
    tx() {
      return this.$store.state.tx;
    },
  },
  mounted() {},
  methods: {
    ...mapActions({
      postTx: POST_TX,
    }),
    resetData() {
      this.wallet_pass_tmp = '';
      (this.password = 'password'),
        (this.undelegate = {
          alert: '',
          validator: this.validator.operator_address,
          amount: 0,
          token: this.globalData.kichain.token,
          fee: 0.00125,
          gasPrice: '0.0000005',
          gasLimit: 300000,
          output: '',
        });
    },
    formatAmount(amount) {
      return tokenUtil.format(amount);
    },
    onResetModal() {
      this.wallet_pass_tmp = '';
      this.$emit('onResetModal');
    },
    async sendUnDelegateTx() {
      this.undelegate.alert = 'danger';
      let filled = true;

      if (!this.undelegate.validator) {
        filled = false;
      }
      if (!this.undelegate.amount) {
        filled = false;
      }
      if (this.undelegate.amount < Math.pow(10, -6)) {
        filled = false;
      }
      if (this.wallet_pass_tmp === '' && !this.multisig) {
        filled = false;
      }

      if (!filled) {
        return false;
      }

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
            type: 'cosmos-sdk/MsgUndelegate',
            value: {
              delegator_address: this.account.id,
              validator_address: this.undelegate.validator,
              amount: {
                denom: this.udenom,
                amount: Math.round(this.undelegate.amount * Math.pow(10, 6)).toString(),
              },
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
        memo: '',
      };

      if (this.multisig) {
        this.undelegate.output =
          '{ "type": "cosmos-sdk/StdTx", "value":' +
          JSON.stringify(transaction) +
          '}';
      }
      else{
        try {
          let res = await this.postTx({
            transaction,
            password: this.wallet_pass_tmp,
          });

          if (res.data.code && res.data.code != 0){
            console.log(res.data.raw_log);
            throw new TypeError(res.data.raw_log)
          }

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
          this.$emit('onUndelegateSuccess');
        } catch (error) {
          this.$bvToast.toast(error.message, {
            title: `Transaction failed`,
            variant: 'danger',
            autoHideDelay: 2000,
            solid: true,
            toaster: 'b-toaster-bottom-center',
          });
          this.$emit('onUndelegateError');
        }
      }
    },
    setTokens(flag){
      var delegation = this.currentWallet.delegation.find(
        d => d.delegation.validator_address === this.validator.operator_address,
      ).balance.amount / Math.pow(10, 6)

        if (flag == 0){ //all
          this.undelegate.amount = delegation
        }

        if (flag == 1){ //half
          this.undelegate.amount =  Number(Math.round(delegation / 2 + 'e6') + 'e-6')
        }
    },
    download() {
      var date_today = util.getFormatedDate()
      return util.download( 'undelegate_' + this.undelegate.amount + 'ki_tx_' + date_today + '.json', document, this.undelegate.output);
    },
  },
};
</script>

<style scoped></style>
