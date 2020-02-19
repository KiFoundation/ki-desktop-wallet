<template>
<div :class="{webwallet:account}">
  <!-- <login v-if="!account" @sendAccount="getAccount" :blockchain="blockchain"></login> -->
  <template>
    <side-bar :balances="balances" :account="account" :blockchain="blockchain" :sequence="sequence" :accountName="accountName"></side-bar>
    <section class="main-info">
      <div class="main-container transfer-container">
        <ul class="tabs nav nav-tabs">
          <li><a class="tab active" data-toggle="tab" href="#transfer-form">{{$t("transfer")}}</a></li>
          <li><a class="tab" data-toggle="tab" href="#delegate-form">{{$t("delegatetx")}}</a></li>
          <li><a class="tab" data-toggle="tab" href="#undelegate-form">{{$t("undelegatetx")}}</a></li>
          <!-- <li><a class="tab" data-toggle="tab" href="#transaction-list">{{$t("transaction_list")}}</a></li> -->

        </ul>

        <!-- ========================Transfer form============================ -->
        <div class="tab-content">
          <div id="transfer-form" class="tab-pane in active">
            <form class="basic-form">
              <label>{{$t("webwallet_to_address")}}</label>
              <input type="text" :placeholder="$t('webwallet_to_address_pl')" v-model="transfer.account">
              <ul class="basic-group clearfix">
                <li class='amount'>
                  <label>{{$t("transfer_amount")}}</label>
                  <input type="text" placeholder="0" v-model="transfer.amount">
                </li>
                <li class="token">
                  <!-- Token -->
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
                <!-- Token -->
                <label>{{$t("webwallet_to_validator")}}</label>
                <select v-model="delegate.validator">
                  <option value="" disabled selected>Select a validator</option>
                  <option v-for="item in validators" :value="item[1]" :key="item[1]">
                    {{item[0]}} - {{item[1]}}
                  </option>
                </select>
              </li>
              <ul class="basic-group clearfix">
                <li class='amount'>
                  <!-- 转账金额 -->
                  <label>{{$t("delegation_amount")}}</label>
                  <input type="text" placeholder="0" v-model="delegate.amount">
                </li>
                <li class="token">
                  <!-- Token -->
                  <label>Token</label>
                  <input type="text" placeholder="0" v-model="transfer.token" disabled>
                </li>
              </ul>

              <a class="btn" @click="sendDelegateTx">{{$t("delegatetx")}}</a>
            </form>
          </div>

          <!-- ========================Undonding form============================ -->
          <div id="undelegate-form" class="transfer tab-pane">
            <form class="basic-form">
              <li class="token">
                <!-- Token -->
                <label>{{$t("webwallet_to_validator")}}</label>
                <select v-model="undelegate.validator">
                  <option value="" disabled selected>Select a validator</option>
                  <option v-for="(item, index) in delegations" :value="index" :key="index">
                    {{item[0]}} - {{item[1]}} {{delegate.token}}
                  </option>
                </select>
              </li>
              <ul class="basic-group clearfix">
                <li class='amount'>
                  <!-- 转账金额 -->
                  <label>{{$t("undelegation_amount")}}</label>
                  <input type="text" placeholder="0" v-model="undelegate.amount">
                </li>
                <li class="token">
                  <!-- Token -->
                  <label>Token</label>
                  <input type="text" placeholder="0" v-model="transfer.token" disabled>

                </li>
              </ul>

              <a class="btn" @click="sendUnDelegateTx">{{$t("undelegatetx")}}</a>
            </form>
          </div>
        </div>
      </div>


      <!-- =======================Mini explorer============================= -->
    </section>

    <section class="main-info">
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
      </div>
    </section>
    <!-- ==================================================== -->


  </template>
</div>
</template>

<script>
import login from 'base/login'
import sideBar from 'base/sidebar'
import common from 'static/js/common.js'
import {
  signTx,
  verifyTx,
  createWalletFromMnemonic,
  createBroadcastTx
} from '@tendermint/sig';


import axios from 'axios';

export default {
  data() {
    return {
      blockchain: 'KiChain',
      prefix: this.globalData.kichain.prefix,
      account: '',
      accountName: '',
      key: '',
      explorer: this.globalData.explorer,
      network: this.globalData.kichain.network,
      unit: this.webCoin.unit,
      selectedSet: 1,
      slider: null, //滚动条DOM元素
      thunk: null, //拖拽DOM元素
      progress: {
        per: 50, //当前值
        min: 10,
        max: 100
      },
      transfer: {
        'account': '',
        'amount': 0,
        'token': 'tki',
        'memo': '',
        'fee': 0.001250,
        'gasPrice': '0.0000005',
        'gasLimit': 200000
      },
      delegate: {
        'validator': '',
        'amount': 0,
        'token': 'tki',
        'fee': 0.001250,
        'gasPrice': '0.0000005',
        'gasLimit': 200000
      },
      undelegate: {
        'validator': '',
        'amount': 0,
        'token': 'tki',
        'fee': 0.001250,
        'gasPrice': '0.0000005',
        'gasLimit': 200000
      },
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
        }
      },
      validators: [],
      delegations: {},
      transactions: []
    }
  },
  created() {
    this.getAccount();
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
    getAccount() {
      if (this.webUtil.getCookie('identity_kichain')) {
        this.account = JSON.parse(this.webUtil.getCookie('identity_kichain')).account;
        this.accountName = JSON.parse(this.webUtil.getCookie('identity_kichain')).accountName;
        this.key = JSON.parse(this.webUtil.getCookie('identity_kichain')).key;
        this.initExtension()
      }
    },
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
          // value, left, width
          // 当value变化的时候，会通过计算属性修改left，width

          // 拖拽的时候获取的新width
          let newWidth = e.clientX - disX + width;
          // 拖拽的时候得到新的百分比
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
    initExtension() {
      let nodeUrl = this.globalData.kichain.nodeUrl;
      this.webUtil.initMathExtension().then((res) => {
        let account = this.account;
        this.progressSlide();
        let provider = mathExtension.httpProvider(nodeUrl);
        let promise1 = new Promise((resolve, reject) => {
          //获取ATOM价格
          this.$http.get('https://api.coinmarketcap.com/v1/ticker/cosmos/?convert=CNY').then(res => {
            if (res) {
              let cosmos = res.data[0];
              this.tokenPrice.rmb = cosmos.price_cny;
              this.tokenPrice.usd = cosmos.price_usd;
            }
            resolve(res.data[0]);
          }, err => {
            reject(err);
          });
        });

        var promise2 = new Promise((resolve, reject) => {
          let krwPrice = 0;
        });

        var promise4 = new Promise((resolve, reject) => {
          provider.get('/txs?message.sender=' + this.account + '&message.action=send').then((res5) => {
            let res = res5.result.txs;

            if (res) {
              res.forEach((value) => {
                let fee = 0

                if (value.tx.value.fee.amount.length > 0) {
                  fee = value.tx.value.fee.amount[0].amount / Math.pow(10, 6)
                }

                this.transactions.push([value.txhash, 'send',
                  value.tx.value.msg[0].value.to_address,
                  value.tx.value.msg[0].value.amount[0].amount / Math.pow(10, 6),
                  fee
                ])

              });
            }
          })
        })

        var promise5 = new Promise((resolve, reject) => {
          provider.get('/txs?message.sender=' + this.account + '&message.action=delegate').then((res6) => {
            let res = res6.result.txs;

            if (res) {
              res.forEach((value) => {
                let fee = 0

                if (value.tx.value.fee.amount.length > 0) {
                  fee = value.tx.value.fee.amount[0].amount / Math.pow(10, 6)
                }

                this.transactions.push([value.txhash, 'delegate',
                  value.tx.value.msg[0].value.validator_address,
                  value.tx.value.msg[0].value.amount.amount / Math.pow(10, 6),
                  fee
                ])

              });
            }
          })
        })

        var promise3 = new Promise((resolve, reject) => {
          provider.get('/auth/accounts/' + account).then((res1) => {
            if (res1.result.result.value) {
              let res = '';
              if (res1.result.result.type == "cosmos-sdk/ContinuousVestingAccount") {
                res = res1.result.result.value.BaseVestingAccount.BaseAccount;
              } else {
                res = res1.result.result.value;
              }

              this.account_number = res.account_number;
              this.sequence = res.sequence;
              let coins = res.coins;
              if (coins) {
                coins.forEach((coin) => {
                  if (coin.denom == 'tki') {
                    this.balances.list.available = parseFloat(coin.amount) / Math.pow(10, 6);
                  }
                });
              }
              this.balances.sum = this.balances.sum + this.balances.list.available;
            }
          }).then((result4) => {
            provider.get('/staking/delegators/' + this.account + '/validators').then((res5) => {
              let res = res5.result.result;
              if (res) {
                res.forEach((value) => {
                  this.delegations[value.operator_address] = [value.description.moniker];
                });
              }
              return 0;
            }).then((result1) => {
              // 获取委托ATOM
              provider.get('/staking/delegators/' + account + '/delegations').then((res2) => {
                let result = res2.result.result;
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
                provider.get('/staking/delegators/' + account + '/unbonding_delegations').then((res3) => {
                  let res = res3.result.result;
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
                  provider.get('/staking/validators').then((res4) => {
                    let res = res4.result.result;
                    if (res) {
                      res.forEach((value) => {
                        this.validators.push([value.description.moniker, value.operator_address]);
                      });
                    }
                    return 0;
                  }).then((balance) => {
                    Promise.all([promise1, promise2]).then(([res1, res2]) => {

                      if (res1) {
                        this.balances.USD = balance * res1.price_usd;
                        this.balances.CNY = balance * res1.price_cny;
                      }
                      if (res1 && res2) {
                        this.balances.KRW = this.balances.CNY / res2;
                      }
                    })
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
      if (!this.transfer.account) {
        alert(this.$t('transfer_account_null'));
        return false;
      }
      if (!this.transfer.amount) {
        alert(this.$t('transfer_amount_null'));
        return false;
      }
      if (this.transfer.amount < Math.pow(10, -6)) {
        alert(this.$t('transfer_amount_min') + Math.pow(10, -6));
        return false;
      }
      let nodeUrl = this.globalData.kichain.nodeUrl;
      let account = this.account;
      let fee = this.transfer.fee * Math.pow(10, 6);
      let limit = 200000;

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

      const signMeta = {
        chain_id: "KiChain",
        account_number: this.account_number.toString(),
        sequence: this.sequence.toString(),
      };

      //TEMP
      const mnemonic = this.key;
      const wallet = createWalletFromMnemonic(mnemonic, "", this.prefix);

      let signedTransactionme = signTx(transaction, signMeta, wallet);
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
      console.log(JSON.stringify(bcTransactionme));

      axios(opts).then(res => {
        let result = res.data;

        if (result.code) {
          let log = JSON.parse(result.raw_log);
          alert(log.message);
        } else if (result.txhash) {
          alert(this.$t('transfer_success'));
          window.location.reload();
        }
      });
    },

    // ========================Delegation Transaction============================
    sendDelegateTx() {
      if (!this.delegate.validator) {
        alert(this.$t('delegate_account_null'));
        return false;
      }
      if (!this.delegate.amount) {
        alert(this.$t('delegate_amount_null'));
        return false;
      }
      if (this.delegate.amount < Math.pow(10, -6)) {
        alert(this.$t('delegate_amount_min') + Math.pow(10, -6));
        return false;
      }
      let nodeUrl = this.globalData.kichain.nodeUrl;

      let account = this.account;
      let provider = mathExtension.httpProvider(nodeUrl);


      let fee = this.delegate.fee * Math.pow(10, 6);
      let limit = 200000;

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

      const signMeta = {
        chain_id: "KiChain",
        account_number: this.account_number.toString(),
        sequence: this.sequence.toString(),
      };

      //TEMP
      const mnemonic = this.key;
      const wallet = createWalletFromMnemonic(mnemonic, "", this.prefix);

      let signedTransactionme = signTx(transaction, signMeta, wallet);
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

      console.log(JSON.stringify(bcTransactionme));

      axios(opts).then(res => {
        let result = res.data;

        if (result.code) {
          let log = JSON.parse(result.raw_log);
          alert(log.message);
        } else if (result.txhash) {
          alert(this.$t('transfer_success'));
          window.location.reload();
        }
      });
    },

    // =========================Unbonding transaction===========================
    sendUnDelegateTx() {
      if (!this.undelegate.validator) {
        alert(this.$t('delegate_account_null'));
        return false;
      }
      if (!this.undelegate.amount) {
        alert(this.$t('delegate_amount_null'));
        return false;
      }
      if (this.undelegate.amount < Math.pow(10, -6)) {
        alert(this.$t('delegate_amount_min') + Math.pow(10, -6));
        return false;
      }
      let nodeUrl = this.globalData.kichain.nodeUrl;

        let account = this.account;
        let provider = mathExtension.httpProvider(nodeUrl);
        // 获取手续费
        // 普通设置
        let fee = this.delegate.fee * Math.pow(10, 6);
        let limit = 200000;
        // 高级设置
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

        if (this.delegations[this.undelegate.validator][1] < this.undelegate.amount) {
          alert("Cannot unbond more than what is bonded!");
        } else {

          const signMeta = {
            chain_id: "KiChain",
            account_number: this.account_number.toString(),
            sequence: this.sequence.toString(),
          };

          //TEMP
          const mnemonic = this.key;
          const wallet = createWalletFromMnemonic(mnemonic, "", this.prefix);

          let signedTransactionme = signTx(transaction, signMeta, wallet);
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

          console.log(JSON.stringify(bcTransactionme));

          axios(opts).then(res => {
            let result = res.data;

            if (result.code) {
              let log = JSON.parse(result.raw_log);
              alert(log.message);
            } else if (result.txhash) {
              alert(this.$t('transfer_success'));
              window.location.reload();
            }
          });
        }
      }
  },
  components: {
    sideBar,
    login
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>

</style>
