<template>
  <b-modal :id="modalId" tabindex="-1" hide-footer @show="resetData">
    <div class="basic-form modal-body">
      <div class="modal-header">
        <h5 class="modal-title">Withdraw all rewards</h5>
      </div>
      <form class="basic-form" v-on:submit.prevent="sendWithdrawTx">
        <div v-if="!multisig">
          <label>{{ $t('enter_password') }}</label>
          <div class="buttonInside">
            <input
              v-model="wallet_pass_tmp"
              :type="password"
              :class="[wallet_pass_tmp ? '' : withdraw.alert]"
            />
            <a v-if="password == 'password'" class="inside" @click="password = 'text'"
              ><img src="/img/icons/eye-on.png" style="width: 25px; opacity: 0.2"
            /></a>

            <a v-if="password == 'text'" class="inside" @click="password = 'password'"
              ><img src="/img/icons/eye-off.png" style="width: 25px; opacity: 0.2"
            /></a>
          </div>
        </div>
        <li v-if="withdraw.output != ''" class="token">
          <label>{{ $t('webwallet_output') }}</label>
          <textarea v-model="withdraw.output" class="" rows="3" disabled />
        </li>
        <b-row align-v="center" align-h="center">
          <b-col class="text-center">
            <button class="btn btn-primary" type="submit" :disabled="tx.loading === true">
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

<script lang="ts">
import { BRow, BCol, BSpinner, BModal } from 'bootstrap-vue';
import { mapState, mapActions } from 'vuex';
import { POST_TX } from '@store/tx';
import util from '@helpers/util';

export default {
  inject: ['globalData'],
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
      explorer: this.globalData.explorer,
      prefix: this.globalData.kichain.prefix,

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
    ...mapState({
      chainId: (state) => state.app.chainId,
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

      const msg_withdraw_reward = [];
      for (const validator of this.validators) {
        if (+this.rewards[validator.operator_address] > 2) {
          msg_withdraw_reward.push({
            type: 'cosmos-sdk/MsgWithdrawDelegationReward',
            value: {
              delegator_address: this.account.id,
              validator_address: validator.operator_address,
            },
          });
        }
      }

      const limit = Math.max(200000, msg_withdraw_reward.length * 100000);
      const fee = limit * 0.025;

      const transaction = {
        msg: [],
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

      transaction.msg = msg_withdraw_reward;

      var msg = [];

      for (var tmsg of transaction.msg) {
        msg.push(util.translateTx(tmsg));
      }

      const fees =
        transaction.fee.amount[0].amount === '0' ? { amount: [], gas: transaction.fee.gas } : transaction.fee;

      if (this.multisig) {
        this.withdraw.output = '{ "type": "cosmos-sdk/StdTx", "value":' + JSON.stringify(transaction) + '}';
      } else {
        try {
          if (msg.length == 0) {
            throw new Error('Not enough rewards to withdraw');
          }

          let res = await this.postTx({
            transaction: {
              msg: msg,
              fees: fees,
              memo: transaction.memo,
              prefix: this.prefix,
              chainId: this.chainId,
            },
            password: this.wallet_pass_tmp,
          });

          if (res.data.tx_response.code && res.data.tx_response.code != 0) {
            throw new TypeError(res.data.tx_response.raw_log);
          }

          const $txhashlink = this.$createElement(
            'a',
            {
              attrs: {
                href: this.explorer + 'transactions/' + res.data.tx_response.txhash,
                target: '_blank',
              },
            },
            res.data.tx_response.txhash.slice(0, 30) + '...'
          );

          this.$bvToast.toast([$txhashlink], {
            title: `Transaction success`,
            variant: 'success',
            autoHideDelay: 2000,
            noCloseButton: true,
            solid: true,
            toaster: 'b-toaster-bottom-center',
          });
          this.$emit('onWithdrawSuccess');
        } catch (error) {
          this.$bvToast.toast(error.message, {
            variant: 'danger',
            autoHideDelay: 5000,
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
