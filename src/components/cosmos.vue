<template>
<div :class="{webwallet:account}">

  <login v-if="!account" @sendAccount="getChain" :blockchain="blockchain"></login>

  <template v-else>

    <side-bar :balances="balances" :account="account" :blockchain="blockchain" :sequence="sequence" :accountName="accountName" :items="wallets" :vesting="vesting"></side-bar>

    <section class="sec-info" >
      <div class="status-container" :style="gradient_style" >
        <b-row>
          <b-col><h4>{{this.accountName}}</h4>
          {{this.account}}</b-col>
          <b-col style="text-align: right;"><h4>{{this.balances.list.available}}{{this.token}}</h4></b-col>
        </b-row>

      </div>
    </section>
    <!-- =======================Transaction forms============================= -->
    <section class="main-info">
      <div>     
      <Burger></Burger>
    </div>

      <!-- <networks></networks> -->
      <div class="main-container transfer-container">
        <div id="sent_alert"></div>
        <ul class="tabs nav nav-tabs">
          <li><a class="tab active" data-toggle="tab" href="#transfer-form">{{$t("transfer")}}</a></li>
          <li><a class="tab" data-toggle="tab" href="#delegate-form">{{$t("delegatetx")}}</a></li>
          <li><a class="tab" data-toggle="tab" href="#undelegate-form">{{$t("undelegatetx")}}</a></li>
          <li><a class="tab" data-toggle="tab" href="#redelegate-form">{{$t("redelegatetx")}}</a></li>
          <li><a class="tab"  data-toggle="tab"  href="#withdraw-form">{{$t("withdrawtx")}}</a></li>
          <li><a class="tab"  @click="refresh">Refresh</a></li>

        </ul>

        <div class="tab-content">
          <!-- ========================Transfer form============================ -->
          <div id="transfer-form" class="tab-pane in active">
            <form class="basic-form">
              <label>{{$t("webwallet_to_address")}}</label>
              <input type="text" :placeholder="$t('webwallet_to_address_pl')" :class="[transfer.account ? '' : transfer.alert]" v-model="transfer.account" list="self_wallets">
              <datalist id="self_wallets">
                <option v-for="item in wallets" :value="item.address" :key="item.address">
                  {{item.account}}
                </option>
              </datalist>
              <ul class="basic-group clearfix">
                <li class='amount'>
                  <label>{{$t("transfer_amount")}}</label>
                  <input type="text" placeholder="0" :class="[transfer.amount ? '' : transfer.alert]" v-model="transfer.amount">
                </li>
                <li class="token">

                  <label>Token</label>
                  <input type="text" placeholder="0" v-model="transfer.token" disabled>
                </li>
              </ul>
              <div class="fee-set">
                <label>{{$t("webwallet_fee")}}</label>
                <label v-show="selectedSet==2" class="setBtn" @click="setToggle(1)">{{$t("webwallet_simple")}}</label>
                <label v-show="selectedSet==1" class="setBtn" @click="setToggle(2)">{{$t("webwallet_advanced")}}</label>

                <ul v-show="selectedSet==1" class="basic-group clearfix">
                  <li class="amount slider" ref="slider">
                    <div class="thunk" :style="{left}" ref="thunk">
                      <div class="block"><img src="static/img/icons/slider@2x.png" width="16"></div>
                    </div>
                    <div class="cheap">{{$t("webwallet_cheap")}}</div>
                    <div class="fast">{{$t("webwallet_fast")}}</div>
                  </li>
                  <li class="token">
                    <div class="input">{{transfer.fee.toFixed(6)}} TKI</div>
                  </li>
                </ul>

                <ul class="basic-group clearfix" v-show="selectedSet==2">
                  <li class='gas-price'>
                    <span>Gas Price (TKI)</span>
                    <input type="text" placeholder="0" v-model="transfer.gasPrice">
                  </li>
                  <li class="gas-limit">
                    <span>Gas Limit</span>
                    <input type="text" placeholder="0" v-model="transfer.gasLimit">
                  </li>
                  <li class="token">
                    <div class="input">{{feeCompute.toFixed(6)}} TKI</div>
                  </li>
                </ul>


              </div>
              <label>{{$t("memo")}}</label>
              <input type="text" :placeholder="$t('webwallet_memo_pl')" v-model="transfer.memo">
              <a class="btn" @click="sendTransfer">{{$t("transfer")}}</a>
            </form>
          </div>

          <!-- ========================Delegation form============================ -->
          <div id="delegate-form" class="transfer tab-pane">
            <form class="basic-form">
              <li class="token">
                <label>{{$t("webwallet_to_validator")}}</label>

                <input type="text"  :placeholder="$t('webwallet_to_validator_pl')" :class="[delegate.validator ? '' : delegate.alert]" v-model="delegate.validator" list="validator_list">
                <datalist id="validator_list">
                  <!-- <option v-for="item in validators" :value="item[1]" :key="item"> -->
                  <option v-for="(item, index) in validators" :value="index" :key="index">
                    {{item[0]}}
                  </option>
                </datalist>
              </li>
              <ul class="basic-group clearfix">
                <li class='amount'>
                  <label>{{$t("delegation_amount")}}</label>
                  <input type="text" placeholder="0" :class="[delegate.amount ? '' : delegate.alert]" v-model="delegate.amount">
                </li>
                <li class="token">
                  <label>Token</label>
                  <input type="text" placeholder="0" v-model="transfer.token" disabled>
                </li>
              </ul>

              <a class="btn" @click="sendDelegateTx">{{$t("delegatetx")}}</a>
            </form>
          </div>

          <!-- ========================Undonding form============================ -->
          <div id="undelegate-form" class="transfer tab-pane">
            <form v-if="Object.keys(this.delegations).length>0" class="basic-form">
              <li class="token">
                <label>{{$t("webwallet_to_validator")}}</label>

                <input type="text" :placeholder="$t('webwallet_to_validator_pl')" :class="[undelegate.validator ? '' : undelegate.alert]" v-model="undelegate.validator" list="validator_unbond_list">
                <datalist id="validator_unbond_list">
                  <option v-for="(item, index) in delegations" :value="index" :key="index">
                    {{item[0]}} - {{item[1]}} {{delegate.token}}
                  </option>
                </datalist>
              </li>
              <ul class="basic-group clearfix">
                <li class='amount'>
                  <label>{{$t("undelegation_amount")}}</label>
                  <input type="text" placeholder="0" :class="[undelegate.amount ? '' : undelegate.alert]" v-model="undelegate.amount">
                </li>
                <li class="token">
                  <label>Token</label>
                  <input type="text" placeholder="0" v-model="transfer.token" disabled>
                </li>
              </ul>

              <a class="btn" @click="sendUnDelegateTx">{{$t("undelegatetx")}}</a>
            </form>
          </div>

          <!-- ========================Redelegation form============================ -->
          <div id="redelegate-form" class="transfer tab-pane">
            <form class="basic-form">
              <li class="token">

                <label>{{$t("webwallet_from_validator")}}</label>

                <input type="text" :placeholder="$t('webwallet_to_validator_pl')" :class="[redelegate.from_validator ? '' : redelegate.alert]" v-model="redelegate.from_validator" list="validator_unbond_list">
                <datalist id="validator_unbond_list">
                  <option v-for="(item, index) in delegations" :value="index" :key="index">
                    {{item[0]}} - {{item[1]}} {{delegate.token}}
                  </option>
                </datalist>

                <label>{{$t("webwallet_to_validator")}}</label>

                <input type="text" :placeholder="$t('webwallet_to_validator_pl')" :class="[redelegate.to_validator ? '' : redelegate.alert]" v-model="redelegate.to_validator" list="validator_list_re">
                <datalist id="validator_list_re">
                  <!-- <option v-for="item in validators" :value="item[1]" :key="item[1]"> -->
                  <option v-for="(item, index) in validators" :value="index" :key="index">
                    {{item[0]}}
                  </option>
                </datalist>
              </li>
              <ul class="basic-group clearfix">
                <li class='amount'>
                  <label>{{$t("undelegation_amount")}}</label>
                  <input type="text" placeholder="0" :class="[redelegate.amount ? '' : redelegate.alert]" v-model="redelegate.amount">
                </li>
                <li class="token">
                  <label>Token</label>
                  <input type="text" placeholder="0" v-model="transfer.token" disabled>

                </li>
              </ul>

              <a class="btn" @click="sendReDelegateTx">{{$t("redelegatetx")}}</a>
            </form>
          </div>
          <!-- ========================Withdraw form============================ -->
          <div id="withdraw-form" class="transfer tab-pane">
            <form class="basic-form">
              <li class="token">

                <label>{{$t("webwallet_from_validator")}}</label>

                <input type="text" :placeholder="$t('webwallet_to_validator_pl')" :class="[withdraw.validator_address ? '' : withdraw.alert]" v-model="withdraw.validator_address" list="validator_withdraw_list">
                <datalist id="validator_withdraw_list">
                  <option v-for="(item, index) in delegations" :value="index" :key="index">
                    {{item[0]}}
                  </option>
                </datalist>
               </li>
              <ul >
                <li >
                  <!-- <label for="checkbox">{{$t("withdraw_with_commission")}}</label>
                  <input type="checkbox" id="checkbox" > -->
                  <label>{{$t("withdraw_config")}}</label>
                  <select v-model="withdraw.config">
                    <option value="0" key="0">Rewards only</option>
                    <option value="1" key="1">Commisions only</option>
                    <option value="2" key="2">Rewards and commissions</option>
                  </select>
                  <span class="local-alert" v-if="(withdraw.config==1 || withdraw.config==2)">{{$t('withdraw_with_commission_alert')}}</span>

                </li>
              </ul>

              <a class="btn" @click="sendWithdrawTx">{{$t("withdrawtx")}}</a>
            </form>
          </div>

        </div>
      </div>
    </section>

      <!-- =======================Mini explorer============================= -->
    <section class="main-info" v-if="transactions.length > 0">
      <div class="main-container transfer-container">
        <table class="table">
          <thead class="thead-null">
            <tr>
              <th scope="col">Tx</th>
              <th scope="col">type</th>
              <th scope="col">To</th>
              <th scope="col">Amount</th>
              <th scope="col">Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transactions">
              <td class="text"><span><a :href="explorer+ 'transactions/' + item[0]" target="_blank">{{item[0]}}</a></span></td>
              <td class="text"><span>{{item[1]}}</span></td>
              <td class="text"><span><a :href="explorer+ 'account/' + item[2]" target="_blank">{{item[2]}}</a></span></td>
              <td class="text"><span>{{item[3]}}</span></td>
              <td class="text"><span>{{item[4]}}</span></td>
            </tr>

          </tbody>

        </table>
        <div class="table-footer">
          <span><a :href="explorer+ 'account/' + this.account" target="_blank">See all transactions</a></span>
        </div>


      </div>
    </section>

  </template>
</div>
</template>

<script>
import Vue from 'vue'
import login from 'base/login'
import sideBar from 'base/sidebar'
import Burger from 'base/burger.vue';
import networks from 'base/networks'
import common from 'static/js/common.js'
import {
  KeyPair,
  signTx,
  verifyTx,
  createWalletFromMnemonic,
  createBroadcastTx
} from '@tendermint/sig';

import {
  BRow,
  BCol,
  BContainer,
} from 'bootstrap-vue'
Vue.component('b-row', BRow);
Vue.component('b-col', BCol);
Vue.component('b-container', BContainer);

import axios from 'axios';

export default {
  data() {
    return {
      blockchain_lowercase: '',
      nodeUrl: '',
      network: '',
      token: '',
      blockchain: 'KiChain',
      prefix: '',
      account: '',
      vesting: false,
      accountName: '',
      key: '',
      publickey: '',
      chainId: '',
      explorer: this.globalData.explorer,
      unit: this.webCoin.unit,
      selectedSet: 1,
      slider: null,
      thunk: null,
      progress: {
        per: 50,
        min: 10,
        max: 100
      },
      transfer: {
        'alert': '',
        'account': '',
        'amount': 0,
        'token': 'tki',
        'memo': '',
        'fee': 0.001250,
        'gasPrice': '0.0000005',
        'gasLimit': 300000
      },
      delegate: {
        'alert': '',
        'validator': '',
        'amount': 0,
        'token': 'tki',
        'fee': 0.001250,
        'gasPrice': '0.0000005',
        'gasLimit': 300000
      },
      undelegate: {
        'alert': '',
        'validator': '',
        'amount': 0,
        'token': 'tki',
        'fee': 0.001250,
        'gasPrice': '0.0000005',
        'gasLimit': 300000
      },
      redelegate: {
        'alert': '',
        'to_validator': '',
        'from_validator': '',
        'amount': 0,
        'token': 'tki',
        'fee': 0.001250,
        'gasPrice': '0.0000005',
        'gasLimit': 300000
      },
      withdraw: {
        'alert': '',
        'validator_address': '',
        'config': 0,
      },

      reward_config: ['rewards only', 'commissions only', 'rewards and commission'],

      account_number: 0,
      sequence: 0,
      values: ['TKI'],
      coin: {
        'cny': 0,
        'usd': 0,
        'krw': 0
      },
      tokenPrice: {
        'rmb': 0,
        'usd': 0
      },
      balances: {
        sum: 0,
        USD: 0,
        CNY: 0,
        KRW: 0,
        list: {
          available: 0,
          delegate: 0,
          undelegate: 0,
          locked: 0,
        }
      },
      validators: {},
      wallets: [],
      delegations: {},
      transactions: [],
      gradient_style:'background-image: linear-gradient(90deg,#1848E0,#05268E);'
    }
  },
  created() {
    this.getChain()
    this.getAccounts();

  },
  mounted() {
    this.getUnit();
  },
  computed: {
    // slider stuff
    scale() {
      return (this.progress.per - this.progress.min) / (this.progress.max - this.progress.min);
    },
    width() {
      if (this.slider) {
        return this.slider.offsetWidth * this.scale + 'px';
      } else {
        return 0 + 'px'
      }
    },
    left() {
      if (this.slider) {
        var left = this.slider.offsetWidth * this.scale - this.thunk.offsetWidth / 2

        if (left <= 0) {
          left = 0
        } else if (left >= this.slider.offsetWidth - this.thunk.offsetWidth) {
          left = this.slider.offsetWidth - this.thunk.offsetWidth
        }
        return left + 'px';
      } else {
        return '0px'
      }
    },
    feeCompute() {
      return this.transfer.gasPrice * this.transfer.gasLimit;

    }
  },

  methods: {
    async getChain() {
      if (this.blockchain) {
        let blockchain = this.blockchain.toLowerCase()
        this.blockchain_lowercase = blockchain
        this.nodeUrl = this.globalData[blockchain].nodeUrl
        this.network = this.globalData[blockchain].network
        this.token = this.globalData[blockchain].token
        this.prefix = this.globalData[blockchain].prefix
      }

      await this.webUtil.getCookie('identity_kichain').then((identity)=>{

        if (identity) {
          let identity_j = JSON.parse(identity)

          this.account = identity_j.account;
          this.accountName = identity_j.accountName;
          this.key = identity_j.privatekey;
          this.publickey = identity_j.publickey;
          this.chainId = identity_j.chainId;
          this.initExtension()
          this.generate_gradient();
        }
      })
    },

    initExtension() {
      let nodeUrl = this.globalData.kichain.nodeUrl;
      this.webUtil.init().then((res10) => {
        let account = this.account;
        this.progressSlide();
        // let provider = mathExtension.httpProvider(nodeUrl);

        var promise2 = new Promise((resolve, reject) => {
          let krwPrice = 0;
        });

        var promise4 = new Promise((resolve, reject) => {
          axios.get(nodeUrl + '/txs?message.sender=' + this.account + '&message.action=send').then((res5) => {
            let page = res5.data.page_total && res5.data.page_total > 0 ? res5.data.page_total : 1;
            return page
          }).then((res) => {
            axios.get(nodeUrl + '/txs?message.sender=' + this.account + '&message.action=send&page=' + res).then((res5) => {

              res = res5.data.txs
              if (res) {
                res.forEach((value) => {
                  let fee = 0

                  if (value.tx.value.fee.amount.length > 0) {
                    fee = value.tx.value.fee.amount[0].amount / Math.pow(10, 6)
                  }

                  this.transactions.push([value.txhash, 'send',
                    value.tx.value.msg[0].value.to_address,
                    value.tx.value.msg[0].value.amount[0].amount / Math.pow(10, 6),
                    fee, value.timestamp
                  ])

                });
              }
            }).then((resx) => {
              this.transactions.sort(
                function(a, b) {
                  const date_a = Date.parse(a[5])
                  const date_b = Date.parse(b[5])

                  let comparison = 0;
                  if (date_a > date_b) {
                    comparison = 1;
                  } else if (date_a < date_b) {
                    comparison = -1;
                  }
                  return comparison * -1;
                })
            })
          })
        })

        var promise5 = new Promise((resolve, reject) => {
          axios.get(nodeUrl + '/txs?message.sender=' + this.account + '&message.action=delegate').then((res6) => {
            let page = res6.data.page_total && res6.data.page_total > 0 ? res6.data.page_total : 1;
            return page
          }).then((res) => {
            axios.get(nodeUrl + '/txs?message.sender=' + this.account + '&message.action=delegate&page=' + res).then((res6) => {
              let res = res6.data.txs;

              if (res) {
                res.forEach((value) => {
                  let fee = 0

                  if (value.tx.value.fee.amount.length > 0) {
                    fee = value.tx.value.fee.amount[0].amount / Math.pow(10, 6)
                  }

                  this.transactions.push([value.txhash, 'delegate',
                    value.tx.value.msg[0].value.validator_address,
                    value.tx.value.msg[0].value.amount.amount / Math.pow(10, 6),
                    fee, value.timestamp
                  ])

                });
              }
            }).then((resx) => {

              this.transactions.sort(function(a, b) {
                const date_a = Date.parse(a[5])
                const date_b = Date.parse(b[5])

                let comparison = 0;
                if (date_a > date_b) {
                  comparison = 1;
                } else if (date_a < date_b) {
                  comparison = -1;
                }
                return comparison * -1;
              })
            })
          })
        })

        var promise3 = new Promise((resolve, reject) => {
          axios.get(nodeUrl + '/auth/accounts/' + account).then((res1) => {
            if (res1.data.result.value) {
              let res = '';
              let available_real = 0;
              if (res1.data.result.type == "cosmos-sdk/ContinuousVestingAccount") {
                this.vesting = true
                res = res1.data.result.value

                // get the original vesting
                let original = parseFloat(res.BaseVestingAccount.original_vesting[0].amount) / Math.pow(10, 6);

                // get vesting period
                let start = res.start_time;
                let end = res.BaseVestingAccount.end_time;

                // get vested amount
                let total_duration = end - start
                let elapsed_suration = (Math.floor(Date.now() / 1000) - start > 0 ) ? Math.floor(Date.now() / 1000) - start : 0
                let vested_ratio = elapsed_suration/total_duration
                let locked = original * (1 - vested_ratio)
                let vested = original - locked

                let delegated = res.BaseVestingAccount.delegated_vesting.length>0 ? parseFloat(res.BaseVestingAccount.delegated_vesting[0].amount) / Math.pow(10, 6) : 0 ;

                this.balances.list.locked = locked

                res = res1.data.result.value.BaseVestingAccount.BaseAccount;
                let coins = res.coins;

                if (coins) {
                  coins.forEach((coin) => {
                    if (coin.denom == 'tki') {
                      this.balances.list.available = parseFloat(coin.amount) / Math.pow(10, 6) - locked  + delegated;
                      available_real = parseFloat(coin.amount) / Math.pow(10, 6) ;
                    }
                  });
                }

              } else {
                res = res1.data.result.value;
                let coins = res.coins;
                if (coins) {
                  coins.forEach((coin) => {
                    if (coin.denom == 'tki') {
                      this.balances.list.available = parseFloat(coin.amount) / Math.pow(10, 6);
                      available_real = this.balances.list.available
                    }
                  });
                }
              }

              this.account_number = res.account_number;
              this.sequence = res.sequence;

              this.balances.sum = this.balances.sum + available_real;
            }
          }).then((result4) => {
            axios.get(nodeUrl + '/staking/delegators/' + this.account + '/validators').then((res5) => {
              let res = res5.data.result;
              if (res) {
                res.forEach((value) => {
                  this.delegations[value.operator_address] = [value.description.moniker];
                });
              }
              return 0;
            }).then((result1) => {
              // 获取委托ATOM
              axios.get(nodeUrl + '/staking/delegators/' + account + '/delegations').then((res2) => {
                let result = res2.data.result;
                if (result) {
                  for (let i = 0; i < result.length; i++) {
                    this.delegations[result[i].validator_address].push(parseFloat(result[i].balance) / Math.pow(10, 6));

                    result[i].shares = parseFloat(result[i].shares) / Math.pow(10, 6);
                    this.balances.list.delegate = this.balances.list.delegate + result[i].shares;
                  }
                  this.balances.sum = this.balances.sum + this.balances.list.delegate;
                }
              }).then((result2) => {
                // 获取解委托ATOM
                axios.get(nodeUrl + '/staking/delegators/' + account + '/unbonding_delegations').then((res3) => {
                  let res = res3.data.result;
                  if (res) {
                    res.forEach((value) => {
                      value.entries.forEach((undelegate) => {
                        let balance = parseFloat(undelegate.balance) / Math.pow(10, 6);
                        this.balances.list.undelegate = this.balances.list.undelegate + balance;
                      });
                    });
                    this.balances.sum = this.balances.sum + this.balances.list.undelegate;
                  }
                  return this.balances.sum;
                }).then((result3) => {
                  // 获取解委托ATOM
                  axios.get(nodeUrl + '/staking/validators').then((res4) => {
                    let res = res4.data.result;
                    if (res) {
                      res.forEach((value) => {
                        // this.validators.push([value.description.moniker, value.operator_address]);
                        this.validators[value.operator_address] = [value.description.moniker];
                      });
                    }
                    return 0;
                  });
                });
              });
            });
          });
        });
      });
    },
    // ========================Transfer Transaction============================
    sendTransfer() {
      this.transfer.alert = "danger"
      let filled = true

      if (!this.transfer.account) {
        filled = false;
      }
      if (!this.transfer.amount) {
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
      let account = this.account;
      let fee = this.transfer.fee * Math.pow(10, 6);
      let limit = 300000;

      if (this.selectedSet == 2) {
        fee = this.transfer.gasPrice * this.transfer.gasLimit * Math.pow(10, 6);
        limit = this.transfer.gasLimit;
      }

      const transaction = {
        'msg': [{
          'type': 'cosmos-sdk/MsgSend',
          'value': {
            'from_address': account,
            'to_address': this.transfer.account,
            'amount': [{
              'denom': 'tki',
              'amount': (this.transfer.amount * Math.pow(10, 6)).toString()
            }]
          }
        }],
        'fee': {
          'amount': [{
            'denom': 'tki',
            'amount': fee.toString()
          }],
          'gas': limit.toString()
        },
        'memo': this.transfer.memo,
      }

      axios.get(nodeUrl + '/auth/accounts/' + account).then((res1) => {
        if (res1.data.result.value) {
          let res = '';
          if (res1.data.result.type == "cosmos-sdk/ContinuousVestingAccount") {
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


      const key = Buffer.from(this.key, 'hex');
      const publickey = Buffer.from(this.publickey, 'hex');


      let signedTransactionme = signTx(transaction, signMeta, {
        'privateKey': key,
        'publicKey': publickey
      });
      let bcTransactionme = createBroadcastTx(signedTransactionme);


      let url = nodeUrl + `/txs?sync=true`;
      const opts = {
        method: 'post',
        url: url,
        data: bcTransactionme,
        headers: {
          "Content-Type": "text/plain",
        }
      };

      axios(opts).then(res => {
        let result = res.data;

        if (result.code) {
          let log = JSON.parse(result.raw_log);
          $('#sent_alert').html(
            '<div class="alert alert-danger alert-dismissible fade show" role="alert"> Transaction failed: '+ log.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
          // alert(log.message);
        } else if (result.txhash) {
          $('#sent_alert').html(
            '<div class="alert alert-success alert-dismissible fade show" role="alert"> Transaction sent: Transfer '+this.transfer.amount+'tki to '+this.transfer.account+' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
          // alert(this.$t('transfer_success'));
          // window.location.reload();
          this.resetForms();
        }
      });
      })
    },
    // ========================Delegation Transaction============================
    sendDelegateTx() {
      this.delegate.alert = "danger"
      let filled = true

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

      let account = this.account;

      let fee = this.delegate.fee * Math.pow(10, 6);
      let limit = 300000;

      if (this.selectedSet == 2) {
        fee = this.delegate.gasPrice * this.delegate.gasLimit * Math.pow(10, 6);
        limit = this.delegate.gasLimit;
      }


      const transaction = {
        'msg': [{
          'type': 'cosmos-sdk/MsgDelegate',
          'value': {
            'delegator_address': account,
            'validator_address': this.delegate.validator,
            'amount': {
              'denom': 'tki',
              'amount': (this.delegate.amount * Math.pow(10, 6)).toString()
            }
          }
        }, ],
        'fee': {
          'amount': [{
            'denom': 'tki',
            'amount': "7500"
          }],
          'gas': limit.toString()
        },
        'memo': "",
      }

      axios.get(nodeUrl + '/auth/accounts/' + account).then((res1) => {
        if (res1.data.result.value) {
          let res = '';
          if (res1.data.result.type == "cosmos-sdk/ContinuousVestingAccount") {
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

      //TEMP
      const key = Buffer.from(this.key, 'hex');
      const publickey = Buffer.from(this.publickey, 'hex');

      let signedTransactionme = signTx(transaction, signMeta, {
        'privateKey': key,
        'publicKey': publickey
      });
      let bcTransactionme = createBroadcastTx(signedTransactionme);

      let url = nodeUrl + `/txs?sync=true`;
      const opts = {
        method: 'post',
        url: url,
        data: bcTransactionme,
        headers: {
          "Content-Type": "text/plain",
        }
      };

      axios(opts).then(res => {
        let result = res.data;

        if (result.code) {
          let log = JSON.parse(result.raw_log);
          $('#sent_alert').html(
            '<div class="alert alert-danger alert-dismissible fade show" role="alert"> Transaction failed: '+ log.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
          // alert(log.message);

        } else if (result.txhash) {
          $('#sent_alert').html(
            '<div class="alert alert-success alert-dismissible fade show" role="alert"> Transaction sent: Delegate ' + this.delegate.amount + 'tki to ' +   this.validators[this.delegate.validator]+ '  <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');

          this.resetForms();
        }
      });
        })
    },
    // =========================Unbonding transaction===========================
    sendUnDelegateTx() {
      this.undelegate.alert = "danger"
      let filled = true

      if (!this.undelegate.validator) {
        // alert(this.$t('delegate_account_null'));
        filled = false;
      }
      if (!this.undelegate.amount) {
        // alert(this.$t('delegate_amount_null'));
        filled = false;
      }
      if (this.undelegate.amount < Math.pow(10, -6)) {
        // alert(this.$t('delegate_amount_min') + Math.pow(10, -6));
        filled = false;
      }

      if (!filled) {
        return false;
      }

      let nodeUrl = this.globalData.kichain.nodeUrl;

      let account = this.account;

      let fee = this.undelegate.fee * Math.pow(10, 6);
      let limit = 300000;

      if (this.selectedSet == 2) {
        fee = this.delegate.gasPrice * this.delegate.gasLimit * Math.pow(10, 6);
        limit = this.delegate.gasLimit;
      }


      const transaction = {
        'msg': [{
          'type': 'cosmos-sdk/MsgUndelegate',
          'value': {
            'delegator_address': account,
            'validator_address': this.undelegate.validator,
            'amount': {
              'denom': 'tki',
              'amount': (this.undelegate.amount * Math.pow(10, 6)).toString()
            }
          }
        }, ],
        'fee': {
          'amount': [{
            'denom': 'tki',
            'amount': "7500"
          }],
          'gas': limit.toString()
        },
        'memo': "",
      }

      axios.get(nodeUrl + '/auth/accounts/' + account).then((res1) => {
        if (res1.data.result.value) {
          let res = '';
          if (res1.data.result.type == "cosmos-sdk/ContinuousVestingAccount") {
            res = res1.data.result.value.BaseVestingAccount.BaseAccount;
          } else {
            res = res1.data.result.value;
          }
          this.sequence = res.sequence;
        }

      if (this.delegations[this.undelegate.validator][1] < this.undelegate.amount) {
        alert("Cannot unbond more than what is bonded!");
      } else {

        const signMeta = {
          chain_id: this.chainId,
          account_number: this.account_number.toString(),
          sequence: this.sequence.toString(),
        };

        //TEMP
        const key = Buffer.from(this.key, 'hex');
        const publickey = Buffer.from(this.publickey, 'hex');

        let signedTransactionme = signTx(transaction, signMeta, {
          'privateKey': key,
          'publicKey': publickey
        });
        let bcTransactionme = createBroadcastTx(signedTransactionme);


        let url = nodeUrl + `/txs?sync=true`;
        const opts = {
          method: 'post',
          url: url,
          data: bcTransactionme,
          headers: {
            "Content-Type": "text/plain",
          }
        };

        axios(opts).then(res => {
          let result = res.data;

          if (result.code) {
            let log = JSON.parse(result.raw_log);
            $('#sent_alert').html(
              '<div class="alert alert-danger alert-dismissible fade show" role="alert"> Transaction failed: '+ log.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
            alert(log.message);
          } else if (result.txhash) {
            $('#sent_alert').html(
              '<div class="alert alert-success alert-dismissible fade show" role="alert"> Transaction sent: Undelegate ' + this.undelegate.amount + 'tki from ' +   this.delegations[this.undelegate.validator][0]+ ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');

            this.resetForms();
          }
        });
      }
    })},
    // =========================Redelegate transaction===========================
    sendReDelegateTx() {
      this.redelegate.alert = "danger"
      let filled = true

      if (!this.redelegate.to_validator) {
        // alert(this.$t('delegate_account_null'));
        filled = false;
      }
      if (!this.redelegate.from_validator) {
        // alert(this.$t('delegate_account_null'));
        filled = false;
      }
      if (!this.redelegate.amount) {
        // alert(this.$t('delegate_amount_null'));
        filled = false;
      }
      if (this.redelegate.amount < Math.pow(10, -6)) {
        // alert(this.$t('delegate_amount_min') + Math.pow(10, -6));
        filled = false;
      }

      if (!filled) {
        return false;
      }

      let nodeUrl = this.globalData.kichain.nodeUrl;

      let account = this.account;

      let fee = this.redelegate.fee * Math.pow(10, 6);
      let limit = 300000;

      if (this.selectedSet == 2) {
        fee = this.redelegate.gasPrice * this.redelegate.gasLimit * Math.pow(10, 6);
        limit = this.redelegate.gasLimit;
      }


      const transaction = {
        'msg': [{
          'type': 'cosmos-sdk/MsgBeginRedelegate',
          'value': {
            'delegator_address': account,
            'validator_src_address': this.redelegate.from_validator,
            'validator_dst_address': this.redelegate.to_validator,
            'amount': {
              'denom': 'tki',
              'amount': (this.redelegate.amount * Math.pow(10, 6)).toString()
            }
          }
        }, ],
        'fee': {
          'amount': [{
            'denom': 'tki',
            'amount': "7500"
          }],
          'gas': limit.toString()
        },
        'memo': "",
      }

      axios.get(nodeUrl + '/auth/accounts/' + account).then((res1) => {
        if (res1.data.result.value) {
          let res = '';
          if (res1.data.result.type == "cosmos-sdk/ContinuousVestingAccount") {
            res = res1.data.result.value.BaseVestingAccount.BaseAccount;
          } else {
            res = res1.data.result.value;
          }
          this.sequence = res.sequence;
        }

      if (this.delegations[this.redelegate.from_validator][1] < this.redelegate.amount) {
        alert("Cannot unbond more than what is bonded!");
      } else {

        const signMeta = {
          chain_id: this.chainId,
          account_number: this.account_number.toString(),
          sequence: this.sequence.toString(),
        };

        //TEMP
        const key = Buffer.from(this.key, 'hex');
        const publickey = Buffer.from(this.publickey, 'hex');

        let signedTransactionme = signTx(transaction, signMeta, {
          'privateKey': key,
          'publicKey': publickey
        });
        let bcTransactionme = createBroadcastTx(signedTransactionme);

        // console.log(JSON.stringify(bcTransactionme), JSON.stringify(signMeta));

        let url = nodeUrl + `/txs?sync=true`;
        const opts = {
          method: 'post',
          url: url,
          data: bcTransactionme,
          headers: {
            "Content-Type": "text/plain",
          }
        };

        axios(opts).then(res => {
          let result = res.data;

          if (result.code) {
            let log = JSON.parse(result.raw_log);
            $('#sent_alert').html(
              '<div class="alert alert-danger alert-dismissible fade show" role="alert"> Transaction failed: '+ log.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
            // alert(log.message);
          } else if (result.txhash) {
            $('#sent_alert').html(
              '<div class="alert alert-success alert-dismissible fade show" role="alert"> Transaction sent: Redelegate ' + this.redelegate.amount + 'tki from ' +   this.delegations[this.redelegate.from_validator][0]+ ' to ' +  this.validators[this.redelegate.to_validator]+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');

            this.resetForms();
          }
        });
      }
    })},
    // =========================Withdraw transaction===========================
    sendWithdrawTx() {
      this.withdraw.alert = "danger"
      let filled = true

      if (!this.withdraw.validator_address) {
        // alert(this.$t('delegate_account_null'));
        filled = false;
      }

      if (!filled) {
        return false;
      }

      let nodeUrl = this.globalData.kichain.nodeUrl;
      let account = this.account;
      let limit = 300000;

      const msg_withdraw_reward = {
        'type': 'cosmos-sdk/MsgWithdrawDelegationReward',
        'value': {
          'delegator_address': account,
          'validator_address': this.withdraw.validator_address,
        }
      }

      const msg_withdraw_commision = {
        'type': 'cosmos-sdk/MsgWithdrawValidatorCommission',
        'value': {
          'validator_address': this.withdraw.validator_address,
        }
      }


      const transaction = {
      'msg': [],
      'fee': {
          'amount': [],
          'gas': limit.toString()
        },
        'memo': "",

      }

      axios.get(nodeUrl + '/auth/accounts/' + account).then((res1) => {
        if (res1.data.result.value) {
          let res = '';
          if (res1.data.result.type == "cosmos-sdk/ContinuousVestingAccount") {
            res = res1.data.result.value.BaseVestingAccount.BaseAccount;
          } else {
            res = res1.data.result.value;
          }
          this.sequence = res.sequence;
        }

      if(this.withdraw.config==0){
        transaction.msg.push(msg_withdraw_reward)
      }

      if(this.withdraw.config==1){
        transaction.msg.push(msg_withdraw_commision)
      }

      if(this.withdraw.config==2){
        transaction.msg.push(msg_withdraw_reward)
        transaction.msg.push(msg_withdraw_commision)
      }

      const signMeta = {
          chain_id: this.chainId,
          account_number: this.account_number.toString(),
          sequence: this.sequence.toString(),
        };

        //TEMP
        const key = Buffer.from(this.key, 'hex');
        const publickey = Buffer.from(this.publickey, 'hex');

        let signedTransactionme = signTx(transaction, signMeta, {
          'privateKey': key,
          'publicKey': publickey
        });
        let bcTransactionme = createBroadcastTx(signedTransactionme);

        let url = nodeUrl + `/txs?sync=true`;
        const opts = {
          method: 'post',
          url: url,
          data: bcTransactionme,
          headers: {
            "Content-Type": "text/plain",
          }
        };

        axios(opts).then(res => {
          let result = res.data;

          if (result.code) {
            let log = JSON.parse(result.raw_log);
            $('#sent_alert').html(
              '<div class="alert alert-danger alert-dismissible fade show" role="alert"> Transaction failed: '+ log.message + ' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
            // alert(log.message);
          } else if (result.txhash) {
            $('#sent_alert').html(
              '<div class="alert alert-success alert-dismissible fade show" role="alert"> Transaction sent: Withdraw ' + this.reward_config[this.withdraw.config] + ' from '+  this.delegations[this.withdraw.validator_address][0]  +' <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
            this.resetForms();
          }
        });
      })

    },

    resetForms() {
      this.mnemonic = '';

      this.transfer.alert = '';
      this.transfer.account = '';
      this.transfer.amount = 0;
      this.transfer.memo= '';
      this.transfer.fee = 0.001250;
      this.transfer.gasPrice = '0.0000005';
      this.transfer.gasLimit =  300000;

      this.delegate.alert = '';
      this.delegate.validator = '';
      this.delegate.amount = 0;

      this.undelegate.alert = '';
      this.undelegate.validator = '';
      this.undelegate.amount = 0;

      this.redelegate.alert = '';
      this.redelegate.to_validator = '';
      this.redelegate.from_validator = '';
      this.redelegate.amount = 0;

      this.withdraw.alert = '';
      this.withdraw.validator_address = '';
      this.withdraw.config = 0;
    },

    resetData() {
      this.balances.sum = 0;
      this.balances.USD = 0;
      this.balances.list.available = 0;
      this.balances.list.delegate = 0;
      this.balances.list.undelegate = 0;
      this.balances.list.locked = 0;
      this.validators = {};
      this.delegations = {};
      this.transactions = [];
    },

    refresh(){
      this.resetForms();
      this.resetData();
      this.initExtension();
    },

    getAccounts() {
      if (localStorage.getItem("wallet_list")) {
        let wallet_list = localStorage.getItem("wallet_list").split(',');
        for (var w in wallet_list) {
          this.wallets.push({
            'account': wallet_list[w],
            'address': JSON.parse(localStorage.getItem(wallet_list[w])).address,
            'privatekey': Buffer.from(JSON.parse(localStorage.getItem(wallet_list[w])).privateKey).toString('hex'),
            'publickey': Buffer.from(JSON.parse(localStorage.getItem(wallet_list[w])).publicKey).toString('hex')
          });
        }
      }
    },

    generate_gradient() {
      let seeds = this.account.match(/.{1,3}/g)
      var hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"];

      function populate(a, index, seed) {
        for ( var i = 6 * (index-1); i < 6 * index; i++ ) {
          Math.seedrandom(seeds[i])
          var x = Math.round(Math.random() * 14 );
          var y = hexValues[x];
          a += y;
        }
        return a;
      }

      var newColor1 = populate('#', 1, 3);
      var newColor2 = populate('#', 2, 3);
      var angle = Math.round( Math.random(3) * 360 );

      var gradient = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
      this.gradient_style = 'background-image:' + gradient;},

      getUnit() {
        common.$on('val', (data) => {
          this.unit = data
        })
      },
      setToggle(val) {
        this.selectedSet = val;
      },
      progressSlide() {
        this.slider = this.$refs.slider;
        this.thunk = this.$refs.thunk;
        let _this = this;
        this.transfer.fee = 0.015 * (this.progress.per / this.progress.max)
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
            _this.transfer.fee = 0.015 * (_this.progress.per / max).toFixed(6)

          }
          document.onmouseup = function(e) {
            document.onmousemove = document.onmouseup = null;
          }
          return false;
        }
      },
  },
  components: {
    login,
    sideBar,
    Burger,
    networks,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

</style>
