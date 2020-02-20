<template>

<div class="login-container main-container">
  <div  id="imported_alert">
  </div>
  <img :src="'static/img/icons/ki-chain.png'" style="margin-top:50px;">
  <div class="info">
    <h1>{{blockchain}} <span>{{$t('webwallet_wallet')}}</span></h1>
    <p><span>{{$t('webwallet_home_create')}}</span></p>

    <div class="deck">
      <a role="button" @click="resetModal" data-toggle="modal" data-target="#import-form" class="custom-card">
        <div class="card" style="width: 15rem; display: inline-block">
          <img src="/static/img/chain/kichain_banner.png" class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text">Import an existing Wallet</p>
          </div>
        </div>
      </a>

      <a role="button" data-toggle="modal" data-target="#add-form" class="custom-card">
        <div class="card" style="width: 15rem; display: inline-block">
          <img src="/static/img/chain/kichain_banner.png" class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text">Generate a new Wallet</p>
          </div>
        </div>
      </a>
    </div>

    <div class="modal fade" id="import-form" tabindex="-1" role="dialog" aria-labelledby="importLongTitle" aria-hidden="true">
      <div class="modal-dialog modal-md modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="importTitle">Import wallet by mnemonic phrase</h5>
          </div>

          <div class="basic-form modal-body">
            <img src="/static/img/chain/kichain_banner.png" class="card-img-top" alt="...">
            <div class="mnemonic-group">
              <li>
                <!-- Token -->
                <label>{{$t("enter_wallet_name")}}</label>
                <input type="text" @input="validateWalltName" v-model="wallet_name" rows="6"></textarea>
                <span class="mnemonic-error" v-if="!name_correct">{{$t('error_wallet_name')}}</span>

                <label>{{$t("enter_mnemonic")}}</label>
                <textarea @input="validate" v-model="mnemonic" rows="6"></textarea>
                <span class="mnemonic-error" v-if="!phrase_correct">{{$t('error_mnemonic')}}</span>
              </li>
            </div>
            <button type="button" @click="importWallet" class="btn btn-primary" :disabled="!disabled" data-dismiss="modal">Import</button>
          </div>
        </div>
      </div>
    </div>



  <div v-if="wallets_found" class="login-box card" style="width: 31.75rem; display: inline-block">
    <p><span>{{$t('webwallet_home_login')}}</span></p>
  <button type="button" @click="login" class="btn btn-primary">Login</button>
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
      wallets_found: false,
      wallet_name: '',
      phrase_correct: true,
      name_correct: true,
      disabled: false,
    }
  },
  created() {
    this.getChain()
  },

  mounted() {
    if (localStorage.getItem("wallet_list")) {
      this.wallets_found = true;
    }

    if (this.webUtil.getCookie("import_success")=='true'){
      console.log("asd")
      $('#imported_alert').html('<div class="alert alert-success alert-dismissible fade show" role="alert"> Wallet imported <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> </button></div>');
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

    validate(evt) {


      let input = this.mnemonic;

      input = input.replace(/(^\s*)|(\s*$)/gi, "");
      input = input.replace(/[ ]{2,}/gi, " ");
      input = input.replace(/\n /, "\n");

      let input_size = input.split(' ').length;

      if (input_size == 24) {
        this.phrase_correct = true;

      } else {
        this.phrase_correct = false;
      }

      this.disabled = this.phrase_correct && this.name_correct

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
      this.disabled = this.phrase_correct && this.name_correct

      if (!this.wallet_name || !this.mnemonic) {
        this.disabled = false
      }
    },

    importWallet() {
      const wallet = createWalletFromMnemonic(this.mnemonic, "", this.prefix);
      let wallet_list = this.wallet_name;

      if (localStorage.getItem("wallet_list")) {
        wallet_list = wallet_list + ',' + localStorage.getItem("wallet_list");
      }
      localStorage.setItem("wallet_list", wallet_list);
      localStorage.setItem(this.wallet_name, JSON.stringify(wallet));

      this.webUtil.setCookie("import_success", 'true', {
          expires: 30,
          path: '/'
        });

        window.location.reload();
    },

    resetModal(){
      this.mnemonic= '';
      this.wallet_name = '';
      this.phrase_correct = true;
      this.name_correct = true;
      this.disabled = false;
    },

    login() {
      let nodeUrl = this.nodeUrl;
      let network = this.network;
      //
      // this.webUtil.initMathExtension().then((res) => {
      //   console.log(res);
      //   return mathExtension.getIdentity(network);
      // }).then((identity) => {
      //   console.log(JSON.stringify(identity));
      //   this.webUtil.setCookie("identity_" + this.blockchain_lowercase, JSON.stringify(identity), {
      //     expires: 30,
      //     path: '/'
      //   });
      //   this.$emit('sendAccount', identity)
      // }).catch(err => {
      //   alert(this.$t('noMathExtension'));
      // })
    }
  }
}
</script>
