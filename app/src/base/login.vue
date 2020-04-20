<template>
<div>
  <!-- <div class="alerts">
    <div class="alert alert-warning alert-dismissible fade show" style="position:relative;" role="alert">
      This tool aims at testing the functionnalities of the <strong>Kichain Testnet</strong> only!
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div> -->

  <!-- <networks></networks> -->

  <div class="login-container main-container">
    <div id="imported_alert">
    </div>
    <img :src="'static/img/icons/ki-chain.png'" style="margin-top:50px;">
    <div class="info">
      <h1>{{this.globalData.kichain.network.network}} <span>{{$t('webwallet_wallet')}}</span></h1>

      <p><span>{{$t('webwallet_home_create')}}</span></p>

      <!-- =======================Modal tabs============================= -->
      <div class="deck">
        <a role="button" @click="resetModal" data-toggle="modal" data-target="#import-form" class="custom-card">
          <div class="card" style="width: 15rem; display: inline-block">
            <img src="static/img/chain/kichain_banner_import.png" class="card-img-top" style="width:60%">
            <div class="card-body">
              <p class="card-text">Import an existing Wallet</p>
            </div>
          </div>
        </a>
        <a role="button" data-toggle="modal" data-target="#add-form" class="custom-card">
          <div class="card" style="width: 15rem; display: inline-block">
            <img src="static/img/chain/kichain_banner_add.png" class="card-img-top" style="width:60%">
            <div class="card-body">
              <p class="card-text">Generate a new Wallet</p>
            </div>
          </div>
        </a>
        <a v-if="wallets_found" role="button" data-toggle="modal" data-target="#login-form" class="custom-card" @click="selected_wallet=wallets[0][0]">
          <div class="card" style="width: 15rem; display: inline-block">
            <img src="static/img/chain/kichain_banner_use.png" class="card-img-top" style="width:60%">
            <div class="card-body">
              <p class="card-text">Use your imported Wallets</p>
            </div>
          </div>
        </a>
      </div>

      <!-- =======================Improt modal============================= -->
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
              <!-- <img src="static/img/chain/kichain_banner.png"  style="width:70%" class="card-img-top"> -->
              <div class="mnemonic-group">
                <li>

                  <label>{{$t("enter_wallet_name")}}</label>
                  <input type="text" @input="validateWalltName();validateWalltNameExist();" v-model="wallet_name">
                  <span class="mnemonic-error" v-if="!name_correct">{{$t('error_wallet_name')}}</span>
                  <span class="mnemonic-error" v-if="name_correct && name_exists">{{$t('error_wallet_name_exists')}}</span>

                <b-row>
                  <b-col cols="3"></b-col>
                  <b-col cols="5" style="padding-left:0px; padding-right:0px;" >
                  <label>{{$t("multisig_wallet_true")}}</label>
                  </b-col>
                  <b-col style="padding-left:0px; padding-right:0px;" cols="1">
                  <div><toggle-button v-model="multisig"  color="#043bea" :height="18" :width="35"  :sync="true"/></div>
                  </b-col>
                  <b-col cols="3"></b-col>
                </b-row>

                <div v-if="!multisig">
                  <label>{{$t("enter_mnemonic")}}</label>
                  <textarea @input="validateMnemonic(0)" v-model="mnemonic" rows="4"></textarea>
                  <span class="mnemonic-error" v-if="!mnemonic_correct">{{$t('error_mnemonic')}}</span>

                  <label>{{$t("create_password")}}</label>
                  <div class="buttonInside">
                    <input :type="password" @input="validatePassword" v-model="wallet_pass_tmp">
                    <span class="mnemonic-error" v-if="!password_correct">{{$t('error_password')}}</span>
                    <a v-if="password=='password'" class="inside" @click="password='text'"><img src="static/img/icons/eye-on.png" style="width:25px; opacity:0.2"></img></a>
                    <a v-if="password=='text'" class="inside" @click="password='password'"><img src="static/img/icons/eye-off.png" style="width:25px; opacity:0.2"></img></a>
                  </div>
                </div>
                <div v-if="multisig">
                  <label>{{$t("enter_public_address")}}</label>
                  <textarea v-model="ms_address" rows="2"></textarea>
                  <!-- <span class="mnemonic-error" v-if="!ms_address_correct">{{$t('error_mnemonic')}}</span> -->
                </div>

              </li>

              </div>
              <button v-if="!multisig" type="button" @click="importWallet" class="btn btn-primary" :disabled="!disabled" data-dismiss="modal">Import</button>
              <button v-if="multisig" type="button" @click="importMultiSigWallet" class="btn btn-primary" :disabled="!name_correct || name_exists ||  wallet_name=='' " data-dismiss="modal">Import</button>
            </div>
          </div>
        </div>
      </div>

      <!-- =======================Create modal============================= -->
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
              <!-- <img src="static/img/chain/kichain_banner.png" style="width:70%" class="card-img-top"> -->
              <div class="mnemonic-group">
                <li>

                  <label>{{$t("enter_wallet_name")}}</label>
                  <input type="text" @input="validateWalltName();validateWalltNameExist();" v-model="wallet_name">
                  <span class="mnemonic-error" v-if="!name_correct">{{$t('error_wallet_name')}}</span>
                  <span class="mnemonic-error" v-if="name_correct && name_exists">{{$t('error_wallet_name_exists')}}</span>

                  <div v-if="generated">
                    <label>{{$t("save_mnemonic")}}</label>
                    <textarea @change="validateMnemonic(1);" v-model="mnemonic_create" rows="4" readonly></textarea>

                    <label>{{$t("create_password")}}</label>
                    <div class="buttonInside">
                      <input :type="password" @input="validatePassword" v-model="wallet_pass_tmp">
                      <span class="mnemonic-error" v-if="!password_correct">{{$t('error_password')}}</span>
                      <a v-if="password=='password'" class="inside" @click="password='text'"><img src="static/img/icons/eye-on.png" style="width:25px; opacity:0.2"></img></a>
                      <a v-if="password=='text'" class="inside" @click="password='password'"><img src="static/img/icons/eye-off.png" style="width:25px; opacity:0.2"></img></a>
                    </div>
                  </div>
                </li>
              </div>
              <button v-if="!generated" type="button" @click="generateWallet();validateMnemonic(1);" class="btn btn-primary" :disabled="!this.wallet_name">Generate</button>
              <button v-else type="button" @click="importWallet" class="btn btn-primary" :disabled="!disabled">Import</button>
            </div>
          </div>
        </div>
      </div>

      <!-- =======================Login modal============================= -->
      <div class="modal fade" id="login-form" tabindex="-1" role="dialog" aria-labelledby="importLongTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-md modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="importTitle">{{$t('webwallet_use_title')}}</h5>
              <button type="button" @click="resetModal" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" style="color:white;">&times;</span>
              </button>
            </div>

            <div class="basic-form modal-body">
              <div class="mnemonic-group">
                <li>
                  <div>
                    <label>{{$t("select_wallet")}}</label>
                    <select class="transactions wallet-select" v-model="selected_wallet">
                      <option value="" disabled selected>Select a wallet to use</option>
                      <option v-for="item in wallets" :value="item[0]" :key="item[0]">
                        {{item[0]}}
                      </option>
                    </select>
                  </div>
                </li>
              </div>
              <button type="button" @click="login" class="btn btn-primary" data-dismiss="modal">Login</button>
            </div>
          </div>
        </div>
      </div>

      <!-- =======================Clear storage============================= -->
      <div v-if="wallets_found" style="width: 31.75rem; display: inline-block">
        <p><span class="stealth-link"> or <a @click="clear">Clear Local storage</a> here</span></p>
      </div>

    </div>

  </div>

  <footer class="copyright">KiFoundation 2020</footer>
</div>

</div>
</template>
<script>
import Vue from 'vue'
import networks from 'base/networks'
import {
  createWalletFromMnemonic
} from '@tendermint/sig';
import {
  BDropdown,
  BDropdownItem
} from 'bootstrap-vue'
Vue.component('b-dropdown-item', BDropdownItem);
Vue.component('b-dropdown', BDropdown);

import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

import AES from 'crypto-js/aes';

export default {
  props: ['blockchain'],
  data() {
    return {
      blockchain_lowercase: '',
      nodeUrl: '',
      network: '',
      token: '',
      mnemonic: '',
      multisig:false,
      ms_address:'',
      mnemonic_create: '',
      wallet_name: '',
      ms_address_correct:false,
      wallets_found: false,
      name_exists: false,
      mnemonic_correct: false,
      name_correct: true,
      password_correct:true,
      disabled: false,
      generated: false,
      wallets: [],
      selected_wallet: '',
      password: 'password',
      wallet_pass_tmp:'',
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
    this.webUtil.getCookie("import_success").then((imported) => {
      if (imported == 'true') {
        $('#imported_alert').html(
          '<div class="alert alert-success alert-dismissible fade show" role="alert"> Wallet imported <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
      }

      this.webUtil.setCookie("import_success", 'false', {
        expires: 30,
        path: '/'
      });
    })


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

    validateMnemonic(type) {
      let input = '';
      if (type == 0) {
        input = this.mnemonic;
      }

      if (type == 1) {
        input = this.mnemonic_create;
      }

      input = input.replace(/(^\s*)|(\s*$)/gi, "");
      input = input.replace(/[ ]{2,}/gi, " ");
      input = input.replace(/\n /, "\n");

      let input_size = input.split(' ').length;

      if (input_size == 24) {
        this.mnemonic_correct = true;

      } else {
        this.mnemonic_correct = false;
      }

      this.disabled = this.mnemonic_correct && this.name_correct && this.password_correct && !this.name_exists

      if (!this.wallet_name || !this.mnemonic || !this.wallet_pass_tmp) {
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
      this.disabled = this.mnemonic_correct && this.name_correct && this.password_correct && !this.name_exists

      if (!this.wallet_name || !this.mnemonic || !this.wallet_pass_tmp) {
        this.disabled = false
      }
    },

    validatePassword() {
      if (!this.wallet_pass_tmp) {
        this.password_correct = false;
      } else {
        var ok_password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
        if (!ok_password.test(this.wallet_pass_tmp)) {
          this.password_correct = false;
        } else {
          this.password_correct = true;
        }
      }
      this.disabled = this.mnemonic_correct && this.name_correct && this.password_correct && !this.name_exists

      if (!this.wallet_name || !this.mnemonic || !this.wallet_pass_tmp) {
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

      this.disabled = this.mnemonic_correct && this.name_correct && this.password_correct && !this.name_exists

      if (!this.wallet_name || !this.mnemonic || !this.wallet_pass_tmp) {
        this.disabled = false
      }
    },

    importMultiSigWallet () {
      // const wallet = createWalletFromMnemonic(this.mnemonic, "", this.prefix);
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
      localStorage.setItem(this.wallet_name, '{"privateKey":"","publicKey":{"type":"Buffer","data":[]},"address":"' + this.ms_address + '"}');

      this.webUtil.setCookie("import_success", 'true', {
        expires: 30,
        path: '/'
      });

      window.location.reload();
    },

    importWallet() {
      var CryptoJS = require("crypto-js");

      // Create the wallet
      const wallet = createWalletFromMnemonic(this.mnemonic, "", this.prefix);
      let wallet_list = this.wallet_name;

      // Store the wallet name in the wallet name list if it doesnot already exist
      if (localStorage.getItem("wallet_list")) {
        let wallet_list_old = localStorage.getItem("wallet_list").split(',');
        if (wallet_list_old.includes(wallet_list)) {
          this.name_exists = true;
        } else {
          wallet_list = wallet_list + ',' + localStorage.getItem("wallet_list");
        }
      }

      // encrypt the private key
      var encrypted_key = CryptoJS.AES.encrypt(wallet.privateKey.toString("hex"), this.wallet_pass_tmp).toString();
      wallet.privateKey = encrypted_key

      // save the encrepted wallet in the local storage
      localStorage.setItem("wallet_list", wallet_list);
      localStorage.setItem(this.wallet_name,  JSON.stringify(wallet));

      this.webUtil.setCookie("import_success", 'true', {
        expires: 30,
        path: '/'
      });

      this.wallet_pass_tmp='';
      window.location.reload();
    },

    generateWallet() {
      const bip39 = require('bip39')
      this.mnemonic_create = bip39.generateMnemonic(256);
      const wallet = createWalletFromMnemonic(this.mnemonic, "", this.prefix);
      this.generated = true;
      this.mnemonic = this.mnemonic_create
      this.name = this.name_create

    },

    resetModal() {
      this.mnemonic = '';
      this.ms_address='';
      this.wallet_name = '';
      this.wallet_pass_tmp = '';
      this.mnemonic_create = '';
      this.disabled = false;
      this.generated = false;
      this.name_exists = false
      this.name_correct = true;
      this.mnemonic_correct = true;
      this.password_correct = true;
    },

    getwallets() {
      if (localStorage.getItem("wallet_list")) {
        let wallet_list = localStorage.getItem("wallet_list").split(',');
        for (var w in wallet_list) {
          this.wallets.push([wallet_list[w], JSON.parse(localStorage.getItem(wallet_list[w])).address]);
        }
      }
    },

    login() {
      let nodeUrl = this.nodeUrl;
        let network = this.network;
        let chainid = this.network.chainId;
        // console.log(this.selected_wallet)
        if (localStorage.getItem("wallet_list")) {
          let identity = '{"blockchain":"cosmos","chainId":"' + chainid + '","accountName":"' + this.selected_wallet + '", "account":"' + JSON.parse(localStorage.getItem(this.selected_wallet)).address + '", "privatekey":"' + JSON.parse(
            localStorage.getItem(this.selected_wallet)).privateKey + '", "publickey":"' + Buffer.from(JSON.parse(localStorage.getItem(this.selected_wallet)).publicKey).toString("hex") + '"}';
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
  },

  components: {
    networks,
  }
}
</script>
