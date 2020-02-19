<template>
<div >
  <section v-if="account" class="user-info text-center">
    <div class="avator"><img :src="'static/img/chain/'+blockchain_lowercase+'_icon@2x.png'" width="90%"></div>
    <h4>{{blockchain}} Wallet</h4>
    <p>{{accountName}}</p>
    <p id="copyContent">{{account}}</p>
    <div class="refresh-logout">
            <a class="grey-fsz refresh" @click="refresh">{{$t('webwallet_refresh')}}</a>

    </div>
    <!-- <div class="operation-list">
      <a class="grey-fsz" id="copyBtn" data-clipboard-target="#copyContent" data-clipboard-action="copy">{{$t("webwallet_copy_address")}}</a>
    </div> -->
    <div class="token-info">
      <!-- 总计 -->
      <p>{{$t("webwallet_total")}} {{token}}</p>
      <h4>{{webUtil.addCommas(balances.sum,6)}} </h4>
      <!-- <p class="grey-fsz">≈ {{webUtil.addCommas(balances[unit])}} {{unit}}</p> -->
      <ul class="token-list">
        <li v-for="(item,index) in balances.list" :key="index">
          <div>{{$t(index)}} {{token}}</div>
          <div>{{item?webUtil.addCommas(item,6):0}}</div>
        </li>
      </ul>
      <ul class="token-list">
        <li>
          <div>Sequence</div>
          <div>{{sequence}}</div>
        </li>
        </li>
      </ul>
    </div>

    <div class="wallet-list">

      <b-table sticky-header  no-border-collapse hover borderless ref="selectableTable"  selectable select-mode="single" :items="items" :fields="fields" @row-selected="onRowSelected" head-variant="null" responsive="sm">
        <!-- Example scoped slot for select state illustrative purposes -->
        <template v-slot:cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>
      </b-table>
    </div>

    <div>
      <!-- <p>
        <b-button size="sm" @click="switchAccount">Use account</b-button>
      </p> -->
      <!-- <p>
      Selected Rows:<br>
      {{ selected }}
    </p> -->
    </div>
  </section>
  <section v-else class="user-info text-center">
    <div class="avator"><img :src="'static/img/chain/'+blockchain_lowercase+'_icon@2x.png'" width="90%"></div>
    <h4>{{blockchain}} Wallet</h4>
    <div class="token-info">
      Selest an account to use
    </div>

    <div class="wallet-list">

      <b-table sticky-header  no-border-collapse hover borderless ref="selectableTable"  selectable select-mode="single" :items="items" :fields="fields" @row-selected="onRowSelected" head-variant="null" responsive="sm">
        <!-- Example scoped slot for select state illustrative purposes -->
        <template v-slot:cell(selected)="{ rowSelected }">
          <template v-if="rowSelected">
            <span aria-hidden="true">&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span aria-hidden="true">&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>
      </b-table>
    </div>

    <!-- <div>
      <p>
        <b-button size="sm" @click="switchAccount">Use account</b-button>
      </p>
    </div> -->
  </section>





</div>
</template>

<script>
import Vue from 'vue'
import common from 'static/js/common.js'
import {
  BootstrapVue,
  IconsPlugin,
  BTable,
  BButton
} from 'bootstrap-vue'
Vue.component('b-table', BTable);
Vue.component('b-button', BButton);



export default {
  props: ['account', 'balances', 'blockchain', 'sequence', 'accountName'],
  data() {
    return {
      unit: this.webCoin.unit,
      blockchain_lowercase: '',
      nodeUrl: '',
      network: '',
      token: '',

      fields: ['account', {key:'address', formatter: value => {
              return value.substring(0,24)+"...";
            }}],
      items:[],

      selectMode: 'single',
      selected: []

    }
  },
  created() {
    this.getChain();
    this.getAccounts();
  },
  mounted() {
    this.copyAddress();
    this.getUnit();
  },
  methods: {

    onRowSelected(items) {
      this.selected = items
      this.switchAccount();
    },

    switchAccount() {
      if (!(this.selected.length > 0)) {
        alert("select an account");
      }

      else{
      var confirmed = confirm("You will switch to the selected account");
      if (confirmed){
      let identity = '{"blockchain":"cosmos","chainId":"KiChain","account":'+JSON.stringify(this.selected[0].address)+', "accountName": '+JSON.stringify(this.selected[0].account)+ ', "key": '+JSON.stringify(this.selected[0].key)+ '}';

      this.webUtil.setCookie("identity_"+this.blockchain_lowercase, identity, {
        expires: 30,
        path: '/'
      });
      this.$emit('sendAccount', identity)
      this.refresh();
      }
      }
    },

    refresh() {
      window.location.reload();
    },

    getChain() {
      if (this.blockchain) {
        let blockchain = this.blockchain.toLowerCase()
        this.blockchain_lowercase = blockchain
        this.nodeUrl = this.globalData[blockchain].nodeUrl
        this.network = this.globalData[blockchain].network
        this.token = this.globalData[blockchain].token
      }
    },
    // logout() {
    //   this.webUtil.initMathExtension().then((res) => {
    //     return mathExtension.getIdentity(this.network);
    //   }).then((identity) => {
    //     mathExtension.forgetIdentity(this.network).then(() => {
    //       this.webUtil.setCookie("identity_" + this.blockchain_lowercase, '', {
    //         expires: -30,
    //         path: '/'
    //       });
    //       window.location.reload();
    //     });
    //   });
    // },
    copyAddress() {
      var clipboard = new this.clipboard("#copyBtn");
      clipboard.on("success", (element => { //复制成功的回调
        alert(this.$t('copy_success'))
      }));
      clipboard.on("error", (element => { //复制失败的回调
        alert(this.$t('copy_fail'));
      }))
    },
    getUnit() {
      // 用$on事件来接收参数
      common.$on('val', (data) => {
        this.unit = data
      })
    },
    getAccounts(){
      this.items = this.accounts.accounts
    }
  }
}
</script>
