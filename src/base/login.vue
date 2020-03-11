<template>
<div>
  <div class="alert alert-warning alert-dismissible fade show" style="position:relative;" role="alert">
    This tool aims at testing the functionnalities of the <strong>Kichain Testnet</strong> only!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="login-container main-container">
    <div id="imported_alert">
    </div>
    <img :src="'static/img/icons/ki-chain.png'" style="margin-top:50px;">
    <div class="info">
      <h1>{{blockchain}} <span>{{$t('webwallet_wallet')}}</span></h1>
      <p><span>{{$t('webwallet_home_create')}}</span></p>

      <div class="deck">
        <a role="button" @click="resetModal" data-toggle="modal" data-target="#import-form" class="custom-card">
          <div class="card" style="width: 15rem; display: inline-block">
            <img src="/static/img/chain/kichain_banner_import.png" class="card-img-top">
            <div class="card-body">
              <p class="card-text">Import an existing Wallet</p>
            </div>
          </div>
        </a>

        <a role="button" data-toggle="modal" data-target="#add-form" class="custom-card">
          <div class="card" style="width: 15rem; display: inline-block">
            <img src="/static/img/chain/kichain_banner_add.png" class="card-img-top">
            <div class="card-body">
              <p class="card-text">Generate a new Wallet</p>
            </div>
          </div>
        </a>
      </div>

      <div class="modal fade" id="import-form" tabindex="-1" role="dialog" aria-labelledby="importLongTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="importTitle">{{$t('webwallet_import_title')}}</h5>
              <button type="button" @click="resetModal" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" style="color:white;">&times;</span>
              </button>
            </div>

            <div class="basic-form modal-body">
              <img src="/static/img/chain/kichain_banner.png" class="card-img-top">
              <div class="mnemonic-group">
                <li>
                  <!-- Token -->
                  <label>{{$t("enter_wallet_name")}}</label>
                  <input type="text" @input="validateWalltName();validateWalltNameExist();" v-model="wallet_name"></textarea>
                  <span class="mnemonic-error" v-if="!name_correct">{{$t('error_wallet_name')}}</span>
                  <span class="mnemonic-error" v-if="name_correct && name_exists">{{$t('error_wallet_name_exists')}}</span>

                  <label>{{$t("enter_mnemonic")}}</label>
                  <textarea @input="validate(0)" v-model="mnemonic" rows="6"></textarea>
                  <span class="mnemonic-error" v-if="!phrase_correct">{{$t('error_mnemonic')}}</span>
                </li>
              </div>
              <button type="button" @click="importWallet" class="btn btn-primary" :disabled="!disabled" data-dismiss="modal">Import</button>
              <!-- <button type="button" @click="resetModal" class="btn btn-secondary" data-dismiss="modal">Cancel</button> -->
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="add-form" tabindex="-1" role="dialog" aria-labelledby="importLongTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="importTitle">{{$t('webwallet_create_title')}}</h5>
              <button type="button" @click="resetModal" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" style="color:white;">&times;</span>
              </button>
            </div>

            <div class="basic-form modal-body">
              <img src="/static/img/chain/kichain_banner.png" class="card-img-top">
              <div class="mnemonic-group">
                <li>
                  <!-- Token -->
                  <label>{{$t("enter_wallet_name")}}</label>
                  <input type="text" @input="validateWalltName();validateWalltNameExist();" v-model="wallet_name"></textarea>
                  <span class="mnemonic-error" v-if="!name_correct">{{$t('error_wallet_name')}}</span>
                  <span class="mnemonic-error" v-if="name_correct && name_exists">{{$t('error_wallet_name_exists')}}</span>

                  <div v-if="generated">
                    <label>{{$t("save_mnemonic")}}</label>
                    <textarea @change="validate(1);"  v-model="mnemonic_create" rows="6" readonly></textarea>
                  </div>
                </li>
              </div>
              <button v-if="!generated" type="button" @click="generateWallet();validate(1);" class="btn btn-primary" :disabled="!this.wallet_name">Generate</button>
              <button v-else type="button" @click="importWallet" class="btn btn-primary" :disabled="!disabled">Import</button>
              <!-- <button type="button" @click="resetModal" class="btn btn-secondary" data-dismiss="modal">Cancel</button> -->
            </div>
          </div>
        </div>
      </div>

      <div v-if="wallets_found" class="login-box card" style="width: 31.75rem; display: inline-block">
        <p><span>{{$t('webwallet_home_login')}}</span></p>
        <div >
          <select class="transactions wallet-select" v-model="selected_wallet">
          <option value="" disabled selected>Select a wallet to use</option>
          <option v-for="item in wallets" :value="item[0]" :key="item[0]">
            {{item[0]}}
          </option>
        </select>
      </div>
        <button type="button" @click="login" class="btn btn-primary">Continue</button>
        <p><span class="stealth-link"> or <a @click="clear">Clear Local storage</a> here</span></p>
      </div>

    </div>
  </div>
</div>
</div>
</template>
<script>
import {
  createWalletFromMnemonic
} from '@tendermint/sig';

export default {
  props: ['blockchain'],
  data() {
    return {
      blockchain_lowercase: '',
      nodeUrl: '',
      network: '',
      token: '',
      mnemonic: '',
      mnemonic_create: '',
      wallet_name: '',
      wallets_found: false,
      name_exists: false,
      phrase_correct: false,
      name_correct: true,
      disabled: false,
      generated: false,
      wallets: [],
      selected_wallet:'',
    }
  },
  created() {
    this.getChain()
  },

  mounted() {
    if (localStorage.getItem("wallet_list")) {
      this.wallets_found = true;
    }

    this.getwallets();

    if (this.webUtil.getCookie("import_success") == 'true') {
      $('#imported_alert').html(
        '<div class="alert alert-success alert-dismissible fade show" role="alert"> Wallet imported <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
    }

    this.webUtil.setCookie("import_success", 'false', {
      expires: 30,
      path: '/'
    });
  },

  methods: {
    getChain() {
      if (this.blockchain) {
        let blockchain = this.blockchain.toLowerCase()
        this.blockchain_lowercase = blockchain
        this.nodeUrl = this.globalData[blockchain].nodeUrl
        this.network = this.globalData[blockchain].network
        this.token = this.globalData[blockchain].token
        this.prefix = this.globalData[blockchain].prefix
      }
    },

    validate(type) {
      let input = '';
      if (type == 0){
        input = this.mnemonic;
      }

      if (type == 1){
        input = this.mnemonic_create;
      }

      input = input.replace(/(^\s*)|(\s*$)/gi, "");
      input = input.replace(/[ ]{2,}/gi, " ");
      input = input.replace(/\n /, "\n");

      let input_size = input.split(' ').length;

      if (input_size == 24) {
        this.phrase_correct = true;

      } else {
        this.phrase_correct = false;
      }

      this.disabled = this.phrase_correct && this.name_correct && !this.name_exists

      if (!this.wallet_name || !this.mnemonic) {
        this.disabled = false
      }
    },

    validateWalltName() {
      if (!this.wallet_name) {
        this.name_correct = false;
      } else {
        if (this.wallet_name.match(/[^\w\.\-]/)) {
          this.name_correct = false;
        } else {
          this.name_correct = true;
        }
      }
      this.disabled = this.phrase_correct && this.name_correct && !this.name_exists

      if (!this.wallet_name || !this.mnemonic) {
        this.disabled = false
      }
    },

    validateWalltNameExist() {
      let wallet_list = this.wallet_name;

      if (localStorage.getItem("wallet_list")) {
        let wallet_list_old = localStorage.getItem("wallet_list").split(',');
        if (wallet_list_old.includes(wallet_list)) {
          this.name_exists = true;
        } else {
          this.name_exists = false;
        }
      }

      this.disabled = this.phrase_correct && this.name_correct && !this.name_exists

      if (!this.wallet_name || !this.mnemonic) {
        this.disabled = false
      }
    },

    importWallet() {
      const wallet = createWalletFromMnemonic(this.mnemonic, "", this.prefix);
      let wallet_list = this.wallet_name;

      if (localStorage.getItem("wallet_list")) {
        let wallet_list_old = localStorage.getItem("wallet_list").split(',');
        if (wallet_list_old.includes(wallet_list)) {
          this.name_exists = true;
        } else {
          wallet_list = wallet_list + ',' + localStorage.getItem("wallet_list");
        }
      }
      localStorage.setItem("wallet_list", wallet_list);
      localStorage.setItem(this.wallet_name, JSON.stringify(wallet));

      this.webUtil.setCookie("import_success", 'true', {
        expires: 30,
        path: '/'
      });

      window.location.reload();
    },

    generateWallet() {
      const bip39 = require('bip39')
      this.mnemonic_create = bip39.generateMnemonic(256);
      const wallet = createWalletFromMnemonic(this.mnemonic, "", this.prefix);
      this.generated = true;
      this.mnemonic = this.mnemonic_create
      // this.validate(1);
      this.name = this.name_create

      // var mnemonics = []
      // for (let i=0; i<10; i++){
      //   const bip39 = require('bip39')
      //   this.mnemonic_create = bip39.generateMnemonic(256);
      //   mnemonics.push(this.mnemonic_create);
      //   const wallet = createWalletFromMnemonic(this.mnemonic_create, "", this.prefix);
      //   console.log('"' +  JSON.stringify(wallet.address) + '": [[' + JSON.parse(JSON.stringify(wallet.privateKey)).data+ '],[' +  JSON.parse(JSON.stringify(wallet.publicKey)).data + ']],')
      // }
      //
      // for (let i=0; i<10; i++){
      //   console.log(mnemonics[i])
      // }
    },

    resetModal() {
      this.mnemonic = '';
      this.mnemonic_create = '';
      this.wallet_name = '';
      this.phrase_correct = true;
      this.name_correct = true;
      this.disabled = false;
      this.name_exists = false
      this.generated = false;
    },


    getwallets(){
      if (localStorage.getItem("wallet_list")) {
        let wallet_list = localStorage.getItem("wallet_list").split(',');
        for (var w in wallet_list){
            this.wallets.push([wallet_list[w], JSON.parse(localStorage.getItem(wallet_list[w])).address]);
        }
      }
    },


    login() {
      let nodeUrl = this.nodeUrl;
      let network = this.network;

      if (localStorage.getItem("wallet_list")) {
        // let wallet_list = localStorage.getItem("wallet_list").split(',');
        // let identity = '{"blockchain":"cosmos","chainId":"KiChain-t","accountName":"' + wallet_list[0] + '", "account":"' + JSON.parse(localStorage.getItem(wallet_list[0])).address + '", "privatekey":"' + Buffer.from(JSON.parse(localStorage.getItem(
        //   wallet_list[0])).privateKey).toString("hex") + '", "publickey":"' + Buffer.from(JSON.parse(localStorage.getItem(wallet_list[0])).publicKey).toString("hex") + '"}';

        let identity = '{"blockchain":"cosmos","chainId":"KiChain-t","accountName":"' + this.selected_wallet + '", "account":"' + JSON.parse(localStorage.getItem(this.selected_wallet)).address + '", "privatekey":"' + Buffer.from(JSON.parse(localStorage.getItem(
          this.selected_wallet)).privateKey).toString("hex") + '", "publickey":"' + Buffer.from(JSON.parse(localStorage.getItem(this.selected_wallet)).publicKey).toString("hex") + '"}';

        this.webUtil.setCookie("identity_" + this.blockchain_lowercase, identity, {
          expires: 30,
          path: '/'
        });
        this.$emit('sendAccount', identity)
      }
    },

    clear() {
      localStorage.clear();
      window.location.reload();

    }
  }
}
</script>
