<template>
  <b-modal :id="modalId" tabindex="-1" hide-footer @show="resetData">
    <div class="basic-form modal-body">
      <div class="modal-header" >
        <h5 class="modal-title">
          Delegate to
          <strong :style="{ fontWeight: '600' }">{{
            validator.description.moniker
          }}</strong>
        </h5>
      </div>
      <form class="basic-form">
        <li class="token">
          <div class="d-flex justify-content-start align-items-center">
            <b-badge variant="light" class="ml-0" :style="{ fontSize: '14px' }">
              {{ delegate.validator }}
            </b-badge>
          </div>
        </li>
        <ul class="basic-group clearfix">
          <li class="amount">
            <div>
              <label>{{ $t('delegation_amount') }}</label>
              <div class="all" >
                <a class="all-link" @click="setTokens(1)"> Half </a> ·
                <a class="all-link" @click="setTokens(0)"> All </a>
              </div>
            </div>
            <input
              v-model="delegate.amount"
              type="text"
              placeholder="0"
              :class="[delegate.amount ? '' : delegate.alert]"
              @input="raiseCDA"
            />

            <transition name="fade">
            <p v-if="show"> 🤑 &nbsp; Piano Piano &nbsp;🤑</p>
          </transition>
          </li>
          <li class="token">
            <label>Token</label>
            <input v-model="token" type="text" placeholder="0" disabled />
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
              :class="[wallet_pass_tmp ? '' : delegate.alert]"
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

        <li v-if="delegate.output != ''" class="token">
          <label>{{ $t('webwallet_output') }}</label>
          <textarea v-model="delegate.output" class="" rows="3" disabled />
        </li>
        <b-row align-v="center" align-h="center">
          <b-col class="text-center">
            <div v-if="!tx.loading">

            <span v-if="!multisig" >
              <a class="btn btn-primary" @click="sendDelegateTx">
                {{ $t('delegatetx') }}
              </a>
            </span>
            <span v-else >
              <a v-if="delegate.output==''" class="btn btn-primary" @click="sendDelegateTx">
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
import { BRow, BCol, BSpinner, BModal, BBadge } from 'bootstrap-vue';
import { mapState, mapActions } from 'vuex';
import { POST_TX } from '@store/tx';
import FeesInput from '@cmp/tx/fees.input';
import util from '@static/js/util';

export default {
  components: {
    BRow,
    BCol,
    BSpinner,
    BModal,
    BBadge,
    FeesInput,
  },
  props: {
    modalId: {
      type: String,
      default: 'delegate-modal',
    },
    validator: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      show:false,
      context: 'Broadcast',
      udenom: this.globalData.kichain.udenom,
      token: this.globalData.kichain.token,
      explorer: this.globalData.explorer,
      delegate: {
        alert: '',
        validator: this.validator.operator_address,
        amount: 0,
        token: this.globalData.kichain.token,
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
      chainId: state => state.app.chainId,
    }),
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
  methods: {
    ...mapActions({
      postTx: POST_TX,
    }),
    resetData() {
      this.wallet_pass_tmp = '';
      (this.password = 'password'),
        (this.delegate = {
          alert: '',
          validator: this.validator.operator_address,
          amount: 0,
          token: this.globalData.kichain.token,
          fee: 0.00125,
          gasPrice: '0.0000005',
          gasLimit: 300000,
          output: '',
        });
        this.show=false;
    },
    formatAmount(amount) {
      return token.format(amount);
    },
    async sendDelegateTx() {
      this.delegate.alert = 'danger';
      let filled = true;

      if (!this.delegate.validator) {
        filled = false;
      }
      if (!this.delegate.amount) {
        filled = false;
      }
      if (this.delegate.amount < Math.pow(10, -6)) {
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
            type: 'cosmos-sdk/MsgDelegate',
            value: {
              delegator_address: this.account.id,
              validator_address: this.delegate.validator,
              amount: {
                denom: this.udenom,
                amount: Math.round(this.delegate.amount * Math.pow(10, 6)).toString(),
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

      const msg = [util.translateTx(transaction.msg[0])]
      const fees = transaction.fee.amount[0].amount === '0' ? { "amount": [], "gas": transaction.fee.gas } : transaction.fee

      if (this.multisig) {
        this.delegate.output =
          '{ "type": "cosmos-sdk/StdTx", "value":' +
          JSON.stringify(transaction) +
          '}';
      }

      else{
      try {
        let res = await this.postTx({
          transaction: {msg: msg, fees: fees, memo: transaction.memo, prefix: this.prefix, chainId: this.chainId} ,
          password: this.wallet_pass_tmp,
        });

        if (res.data.code && res.data.code != 0){
          throw new TypeError(res.data.raw_log)
        }

        const $txhashlink = this.$createElement(
          'a',
          {
            attrs: {
                href:  this.explorer + "transactions/" + res.data.tx_response.txhash,
                target: "_blank"
              }
          },
           res.data.tx_response.txhash.slice(0, 30) + "..."
        )

        this.$bvToast.toast([$txhashlink] , {
          title: `Transaction success`,
          variant: 'success',
          autoHideDelay: 5000,
          solid: true,
          toaster: 'b-toaster-bottom-center',
        });
        this.$emit('onDelegateSuccess');
      } catch (error) {
        this.$bvToast.toast(error.message, {
          title: `Transaction failed`,
          variant: 'danger',
          autoHideDelay: 2000,
          solid: true,
          toaster: 'b-toaster-bottom-center',
        });
        this.$emit('onDelegateError');
      }

    }
    },
    setTokens(flag){

        var available_tokens = parseFloat(this.currentWallet.balances.available.replace(/,/g, ""))

        if (flag == 0){ //all
          this.delegate.amount = available_tokens -1 > 0 ? available_tokens -1 : 0
        }

        if (flag == 1){ //half
          this.delegate.amount =  available_tokens > 1 ? Number(Math.round(available_tokens / 2 + 'e6') + 'e-6') : 0
        }
    },

    raiseCDA(){
      if (parseFloat(this.currentWallet.balances.delegated.replace(/,/g, "")) > 100000000 && this.delegate.amount > 100){
        this.show = true
      }
      if (this.delegate.amount < 100 || this.delegate.amount == ""){
        this.show = false
      }
    },
    download(){
      var date_today = util.getFormatedDate()
      return util.download( date_today + '_delegate_' + this.delegate.amount + 'xki' + '.json', document, this.delegate.output);
    }
  },
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
