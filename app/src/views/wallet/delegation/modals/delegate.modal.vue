<template>
  <b-modal
    :id="modalId"
    tabindex="-1"
    :title="`Delegate to ${validator.description.moniker}`"
    hide-footer
    @show="resetData"
  >
    <div class="basic-form modal-body">
      <form class="basic-form">
        <li class="token">
          <!-- <label class="mt-0">
            <strong>{{ validator.description.moniker }}</strong> -
            {{ formatAmount(validator.tokens) }}
          </label> -->
          <div class="d-flex justify-content-center align-items-center">
            To
            <b-badge variant="light" class="ml-2" :style="{ fontSize: '14px' }">
              {{ delegate.validator }}
            </b-badge>
          </div>
        </li>
        <ul class="basic-group clearfix">
          <li class="amount">
            <label>{{ $t('delegation_amount') }}</label>
            <input
              v-model="delegate.amount"
              type="text"
              placeholder="0"
              :class="[delegate.amount ? '' : delegate.alert]"
            />
          </li>
          <li class="token">
            <label>Token</label>
            <input v-model="token" type="text" placeholder="0" disabled />
          </li>
        </ul>

        <ul class="basic-group clearfix">
          <FeesInput v-model="fees" />
        </ul>

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
        <li v-if="delegate.output != ''" class="token">
          <label>{{ $t('webwallet_output') }}</label>
          <textarea v-model="delegate.output" class="" rows="3" disabled />
        </li>
        <b-row align-v="center" align-h="center">
          <b-col class="text-center">
            <button
              class="btn btn-primary"
              :disabled="tx.loading === true"
              @click="sendDelegateTx"
            >
              <div v-if="!tx.loading">
                <span v-if="context == 'Broadcast' || (!advanced && !multisig)">
                  {{ $t('delegatetx') }}
                </span>
                <span v-else>{{ context }}</span>
              </div>
              <div v-else>
                <b-spinner small label="Small Spinner" />
              </div>
            </button>
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
  </b-modal>
</template>

<script>
import { BRow, BCol, BSpinner, BModal, BBadge } from 'bootstrap-vue';
import * as numeral from 'numeral';
import { mapActions } from 'vuex';
import { POST_TX } from '@store/tx';
import { tokenUtil } from '@static/js/token';
import FeesInput from '@cmp/tx/fees.input';

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
      context: 'Broadcast',
      token: this.globalData.kichain.token,
      delegate: {
        alert: '',
        validator: this.validator.operator_address,
        amount: 0,
        token: 'tki',
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
          token: 'tki',
          fee: 0.00125,
          gasPrice: '0.0000005',
          gasLimit: 300000,
          output: '',
        });
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
      if (this.wallet_pass_tmp === '') {
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
                denom: 'tki',
                amount: (this.delegate.amount * Math.pow(10, 6)).toString(),
              },
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
        memo: '',
      };

      if (this.context == 'Generate') {
        this.delegate.output =
          '{ "type": "cosmos-sdk/StdTx", "value":' +
          JSON.stringify(transaction) +
          '}';
      }

      if (this.context == 'Broadcast') {
        try {
          await this.postTx({
            transaction,
            password: this.wallet_pass_tmp,
          });
          this.$bvToast.toast('Transaction sent with success', {
            variant: 'success',
            autoHideDelay: 2000,
            solid: true,
            noCloseButton: true,
            toaster: 'b-toaster-bottom-center',
          });
          this.$emit('onDelegateSuccess');
        } catch (error) {
          this.$bvToast.toast(error, {
            variant: 'danger',
            autoHideDelay: 2000,
            solid: true,
            noCloseButton: true,
            toaster: 'b-toaster-bottom-center',
          });
          this.$emit('onDelegateError');
        }
      }
    },
  },
};
</script>

<style scoped></style>
