<template>
  <b-modal
    :id="modalId"
    tabindex="-1"
    hide-footer
    @show="resetData"
  >
    <div class="basic-form modal-body">
      <div class="modal-header" >
        <h5 class="modal-title">
          Withdraw all rewards
        </h5>
      </div>
      <form class="basic-form">
        <div v-if="!multisig">
          <label>{{ $t('enter_password') }}</label>
          <div class="buttonInside">
            <input
              v-model="wallet_pass_tmp"
              :type="password"
              :class="[wallet_pass_tmp ? '' : withdraw.alert]"
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
        <li v-if="withdraw.output != ''" class="token">
          <label>{{ $t('webwallet_output') }}</label>
          <textarea v-model="withdraw.output" class="" rows="3" disabled />
        </li>
        <b-row align-v="center" align-h="center">
          <b-col class="text-center">
            <button
              class="btn btn-primary"
              :disabled="tx.loading === true"
              @click="sendWithdrawTx"
            >
              <div v-if="!tx.loading">
                <span v-if="!multisig">
                  {{ $t('withdrawtx') }}
                </span>
                <span v-else>Generate</span>
              </div>
              <div v-else>
                <b-spinner small label="Small Spinner" />
              </div>
            </button>
          </b-col>
        </b-row>
      </form>
    </div>
  </b-modal>
</template>

<script>
import { BRow, BCol, BSpinner, BModal } from 'bootstrap-vue';
import * as numeral from 'numeral';
import { mapActions } from 'vuex';
import { POST_TX } from '@store/tx';
export default {
  components: {
    BRow,
    BCol,
    BSpinner,
    BModal,
  },
  props: {
    modalId: {
      type: String,
      default: 'withdraw-all-modal',
    },
    validators: {
      type: Array,
      default: null,
    },
    rewards: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      udenom: this.globalData.kichain.udenom,
      withdraw: {
        alert: '',
        config: 0,
        output: '',
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
  methods: {
    ...mapActions({
      postTx: POST_TX,
    }),
    resetData() {
      this.wallet_pass_tmp = '';
      (this.password = 'password'),
        (this.withdraw = {
          alert: '',
          config: 0,
          output: '',
        });
    },
    async sendWithdrawTx() {
      this.withdraw.alert = 'danger';
      let filled = true;

      if (this.wallet_pass_tmp === '' && !this.multisig) {
        filled = false;
      }

      if (!filled) {
        return false;
      }

      var msg_withdraw_reward = []
      for ( var validator of this.validators ){
        if (numeral(this.rewards[validator.operator_address]).value() > 2 ){
          msg_withdraw_reward.push({
            type: 'cosmos-sdk/MsgWithdrawDelegationReward',
            value: {
              delegator_address: this.account.id,
              validator_address: validator.operator_address,
            },
          })
        }
      }

      const limit = Math.max(200000, msg_withdraw_reward.length * 100000);
      const fees = limit * 0.025


      const transaction = {
        msg: [],
        fee: {
          amount: [{
            denom: this.udenom,
            amount: fees.toString(),
          }],
          gas: limit.toString(),
        },
        memo: '',
      };

      transaction.msg = msg_withdraw_reward;

      if (this.multisig) {
        this.withdraw.output =
          '{ "type": "cosmos-sdk/StdTx", "value":' +
          JSON.stringify(transaction) +
          '}';
      }

      else {
        try {
          await this.postTx({
            transaction,
            password: this.wallet_pass_tmp,
          });
          this.$bvToast.toast('Transaction sent with success', {
            variant: 'success',
            autoHideDelay: 2000,
            noCloseButton: true,
            solid: true,
            toaster: 'b-toaster-bottom-center',
          });
          this.$emit('onWithdrawSuccess');
        } catch (error) {
          this.$bvToast.toast(error, {
            variant: 'danger',
            autoHideDelay: 2000,
            solid: true,
            noCloseButton: true,
            toaster: 'b-toaster-bottom-center',
          });
          this.$emit('onWithdrawError');
        }
      }
    },
  },
};
</script>

<style scoped></style>
