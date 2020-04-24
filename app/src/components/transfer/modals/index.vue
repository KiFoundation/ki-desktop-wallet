<template>
  <div
    :id="modalId"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="importLongTitle"
    aria-hidden="true"
    data-backdrop="static"
    data-keyboard="false"
  >
    <div class="modal-dialog modal-md modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="importTitle" class="modal-title">
            {{ $t('transfer_modal_title') }}
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="onResetModal"
          >
            <span aria-hidden="true" style="color:white;">&times;</span>
          </button>
        </div>

        <div class="basic-form modal-body d-flex w-100">
          <!-- ========================Transfer form============================ -->
          <div id="transfer-form" class="tab-pane in active w-100">
            <form class="basic-form">
              <label>{{ $t('webwallet_to_address') }}</label>
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

                <ul v-show="selectedSet == 1" class="basic-group clearfix">
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

                <ul v-show="selectedSet == 2" class="basic-group clearfix">
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
                <textarea
                  v-model="transfer.output"
                  class=""
                  rows="3"
                  disabled
                />
              </li>
              <b-row align-v="center">
                <b-col class="d-flex justify-content-center">
                  <a class="btn" @click="sendTransfer">
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
      </div>
    </div>
  </div>
</template>

<script>
import {
  KeyPair,
  signTx,
  verifyTx,
  createWalletFromMnemonic,
  createBroadcastTx,
} from '@tendermint/sig';
import { BRow, BCol, BContainer } from 'bootstrap-vue';
import { store } from '@store';

export default {
  components: {
    BRow,
    BCol,
  },
  props: {
    modalId: {
      type: String,
      default: 'modalId',
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
    wallets() {
      return store.wallets.list;
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
    account() {
      return store.account;
    },
  },
  methods: {
    onResetModal() {
      console.log(this.account);
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
        // alert(this.$t('transfer_amount_min') + Math.pow(10, -6));
        filled = false;
      }

      if (!filled) {
        return false;
      }

      let nodeUrl = this.globalData.kichain.nodeUrl;
      let account = this.account.address;
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

      if (this.context == 'Generate') {
        this.transfer.output =
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
          this.transfer.output = JSON.stringify(signedTransactionme);
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
                '<div class="alert alert-success alert-dismissible fade show" role="alert"> Transaction sent: Transfer ' +
                  this.transfer.amount +
                  'tki to ' +
                  this.transfer.account +
                  '. Check it <a target="_blank" href=https://blockchain.ki/transactions/' +
                  result.txhash +
                  '>here.</a>' +
                  ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>',
              );
              // alert(this.$t('transfer_success'));
              // window.location.reload();
              this.resetForms();
            }
          });
        }
      });
    },
    // Do What ??
    setToggle(val) {
      this.selectedSet = val;
    },
  },
};
</script>

<style scoped></style>
