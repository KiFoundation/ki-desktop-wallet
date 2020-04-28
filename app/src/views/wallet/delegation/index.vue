<template>
  <div>
    <!-- ========================Delegation form============================ -->
    <div id="delegate-form" class="transfer tab-pane">
      <form class="basic-form">
        <li class="token">
          <label>{{ $t('webwallet_to_validator') }}</label>

          <input
            v-model="delegate.validator"
            type="text"
            :placeholder="$t('webwallet_to_validator_pl')"
            :class="[delegate.validator ? '' : delegate.alert]"
            list="validator_list"
          />
          <datalist id="validator_list">
            <option
              v-for="(item, index) in currentWallet.validators"
              :key="index"
              :value="item.operator_address"
            >
              {{ item.description.moniker }}
            </option>
          </datalist>
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
            <input
              v-model="transfer.token"
              type="text"
              placeholder="0"
              disabled
            />
          </li>
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
            <a class="btn" @click="sendDelegateTx">
              <span v-if="context == 'Broadcast' || (!advanced && !multisig)">
                {{ $t('delegatetx') }}
              </span>
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
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BRow, BCol } from 'bootstrap-vue';

export default {
  components: {
    BRow,
    BCol,
  },
  data() {
    return {
      context: 'Broadcast',
      delegate: {
        alert: '',
        validator: '',
        amount: 0,
        token: 'tki',
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
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
    currentWallet() {
      return this.$store.state.wallets.current;
    },
    advanced() {
      return this.$store.state.app.advanced;
    },
    account() {
      return this.$store.state.account;
    },
  },
  methods: {
    sendDelegateTx() {
      this.delegate.alert = 'danger';
      let filled = true;

      if (!this.delegate.validator) {
        // alert(this.$t('delegate_account_null'));
        filled = false;
      }
      if (!this.delegate.amount) {
        // alert(this.$t('delegate_amount_null'));
        filled = false;
      }
      if (this.delegate.amount < Math.pow(10, -6)) {
        // alert(this.$t('delegate_amount_min') + Math.pow(10, -6));
        filled = false;
      }

      if (!filled) {
        return false;
      }

      let nodeUrl = this.globalData.kichain.nodeUrl;

      let fee = this.delegate.fee * Math.pow(10, 6);
      let limit = 300000;

      if (this.selectedSet == 2) {
        fee = this.delegate.gasPrice * this.delegate.gasLimit * Math.pow(10, 6);
        limit = this.delegate.gasLimit;
      }

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
              amount: '7500',
            },
          ],
          gas: limit.toString(),
        },
        memo: '',
      };
      /* if (this.context == 'Generate') {
        this.delegate.output =
          '{ "type": "cosmos-sdk/StdTx", "value":' +
          JSON.stringify(transaction) +
          '}';
      }

      axios.get(nodeUrl + '/auth/accounts/' + account).then(res1 => {
        if (res1.data.result.value) {
          let res = '';
          if (res1.data.result.type == 'cosmos-sdk/ContinuousVestingAccount') {
            res = res1.data.result.value.BaseVestingAccount.BaseAccount;
          } else {
            res = res1.data.result.value;
          }
          this.sequence = res.sequence;
        }
        const signMeta = {
          chain_id: this.chainId,
          account_number: this.account_number.toString(),
          sequence: this.sequence.toString(),
        };

        var CryptoJS = require('crypto-js');
        var bytes = CryptoJS.AES.decrypt(this.key, this.wallet_pass_tmp);
        let key = Buffer.from(bytes.toString(CryptoJS.enc.Utf8), 'hex');

        const publickey = Buffer.from(this.publickey, 'hex');

        let signedTransactionme = signTx(transaction, signMeta, {
          privateKey: key,
          publicKey: publickey,
        });

        if (this.context == 'Sign') {
          this.delegate.output = JSON.stringify(signedTransactionme);
        }

        if (this.context == 'Broadcast') {
          let bcTransactionme = createBroadcastTx(signedTransactionme);

          let url = nodeUrl + `/txs?sync=true`;
          const opts = {
            method: 'post',
            url: url,
            data: bcTransactionme,
            headers: {
              'Content-Type': 'text/plain',
            },
          };

          axios(opts).then(res => {
            let result = res.data;

            if (result.code) {
              let log = JSON.parse(result.raw_log);
              $('#sent_alert').html(
                '<div class="alert alert-danger alert-dismissible fade show" role="alert"> Transaction failed: ' +
                  log.message +
                  ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>',
              );
              // alert(log.message);
            } else if (result.txhash) {
              $('#sent_alert').html(
                '<div class="alert alert-success alert-dismissible fade show" role="alert"> Transaction sent: Delegate ' +
                  this.delegate.amount +
                  'tki to ' +
                  this.validators[this.delegate.validator] +
                  '. Check it <a target="_blank" href=https://blockchain.ki/transactions/' +
                  result.txhash +
                  '>here.</a>' +
                  '  <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>',
              );

              this.resetForms();
            }
          });
        }
      }); */
    },
  },
};
</script>

<style scoped></style>
