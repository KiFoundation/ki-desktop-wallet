<template>
<div :id="modalId" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="importLongTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <!-- <h5 id="importTitle" class="modal-title">
          {{ $t('webwallet_import_title') }}
        </h5> -->
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="onResetModal">
          <span aria-hidden="true" >&times;</span>
        </button>
      </div>

      <div class="basic-form modal-body">
        <div class="mnemonic-group">
          <div class="modal-header" >
             <h5 id="importTitle" class="modal-title">
              {{ $t('webwallet_import_title') }}
            </h5>
          </div>
          <div class="mnemonic-form">

            <div v-if="step==0">
              <b-row style="margin-bottom:10px;">
                <b-col cols="6">
                  <h6>Wallet name</h6>
                </b-col>
                <b-col />
              </b-row>
              <b-row style="margin-bottom:20px;">
                <b-col>Give a name to your wallet to distinguish it in the wallet list </b-col>
              </b-row>
              <input v-model="wallet_name" type="text" @input="
                    validateWalltName();
                    validateWalltNameExist();
                  " />
              <span v-if="!name_correct" class="mnemonic-error">{{
                  $t('error_wallet_name')
                }}</span>
              <span v-if="name_correct && name_exists" class="mnemonic-error">
                {{ $t('error_wallet_name_exists') }}
              </span>

              <b-row style="margin-bottom:10px;margin-top:20px;">
                <b-col cols="6">
                  <h6>Account type</h6>
                </b-col>
                <b-col />

              </b-row>
              <b-row style="margin-bottom:15px;" align-v="center">
                <b-col cols="7">{{ $t('offline_wallet') }}</b-col>
                <b-col style="text-align: right;">
                  <b-button-group size="sm">
                    <b-button v-for="(btn, idx) in buttons" :key="idx" :pressed="filter_offline === btn.filter" variant="outline-primary" style="margin-top:0px;" @click="btn.onPress('offline')">
                      {{ btn.caption }}
                    </b-button>
                  </b-button-group>
                </b-col>
              </b-row>

              <b-row style="margin-bottom:15px;" align-v="center" v-if="!offline_wallet">
                <b-col cols="7">{{ $t('multisig_wallet_true') }}</b-col>
                <b-col style="text-align: right;">
                  <b-button-group size="sm">
                    <b-button v-for="(btn, idx) in buttons" :key="idx" :pressed="filter === btn.filter" variant="outline-primary" style="margin-top:0px;" @click="btn.onPress('ms')">
                      {{ btn.caption }}
                    </b-button>
                  </b-button-group>
                </b-col>
              </b-row>
            </div>
          </div>

          <div style="margin-bottom:20px">
            <div class="mnemonic-form">
              <b-row v-if="step!=0" style="margin-bottom:10px">
                <!-- Mnemonic views -->
                <b-col v-if="step==1 && !multisig && !offline_wallet && import_mode==='m'">
                  <b-row style="margin-bottom:10px;">
                    <b-col cols="6">
                      <h6>Your mnemonic</h6>
                    </b-col>
                    <b-col />
                    <b-col style="text-align:right" cols="4">
                      <a class="stealth-link" @click="resetMnemonic()">Erase mnemonic</a>
                    </b-col>
                  </b-row>
                  <b-row style="margin-bottom:20px;">
                    <b-col v-if="!multisig">Fill in or paste your wallet mnemonic to proceed</b-col>
                    <b-col v-if="multisig">Enter your multisignature address to proceed</b-col>
                  </b-row>

                  <div class="contents">
                    <!-- Generated mnemonic array -->
                    <div v-if="step==1" class="phrases">
                      <ul>
                        <li>
                          <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                            <label style="margin:0px;" :for="'w0'">1.</label> <input autocomplete="off" :id="'w0'" type="text" v-model="mnemonic_array[0]" @input="parseMnemonic" />
                          </div>
                        </li>
                        <li v-for="(item, idx) in new Array(23)" v-bind:key="'w'+(idx+2)">
                          <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                            <label style="margin:0px;" :for="'w'+(idx+2)">{{idx+2}}.</label> <input autocomplete="off" :id="'w'+ (idx+2)" type="text" v-model="mnemonic_array[idx+1]" @input=" validateMnemonic(0)" />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </b-col>

                <b-col v-if="step==1 && !multisig && !offline_wallet && import_mode==='k'">
                  <b-row style="margin-bottom:10px;">
                    <b-col cols="6">
                      <h6>Your private key</h6>
                    </b-col>
                  </b-row>
                  <b-row style="margin-bottom:20px;">
                    <b-col>Paste your private key here</b-col>
                  </b-row>
                  <textarea v-model="private_key" @input="validatePrivKey()"/>
                  <span v-if="!private_key_correct" class="mnemonic-error">{{$t('error_privatekey')}}</span>

                </b-col>



                <b-col v-if="step==1 && multisig && !offline_wallet">
                  <label>{{ $t('enter_public_address') }}</label>
                  <textarea v-model="ms_address" rows="1" @input="validateAddress" :disabled="require_ms_data" />
                  <div v-if="require_ms_data" class="optional-area">
                    <p>{{ $t('ms_address_unknown') }}</p>
                    <label >{{ $t('enter_ms_address_threshold') }}</label>
                    <input type='number' min="1" v-model="ms_address_threshold" @input="validateMsData();"/>
                    <label>{{ $t('enter_ms_address_pubkeys') }}</label>
                    <textarea v-model="ms_address_pubkeys" rows="2" @input="validateMsData();"/>
                    <span v-if="!ms_data_pk_correct" class="warning">{{
                        $t('enter_ms_address_pubkeys_error')
                      }}</span>
                    <b-row style="margin-bottom:20px;" align-v="center">
                      <b-col cols="7"><label>{{ $t('enter_ms_address_pubkeys_sorted') }}</label></b-col>
                      <b-col style="text-align: right;">
                        <b-button-group size="sm" style="margin-top:32px">
                          <b-button v-for="(btn, idx) in buttons" :key="idx" :pressed="filter_sort === btn.filter" variant="outline-primary" style="margin-top:0px;" @click="btn.onPress('sort')">
                            {{ btn.caption }}
                          </b-button>
                        </b-button-group>
                      </b-col>
                    </b-row>
                  </div>

                </b-col>
                <b-col v-if="offline_wallet">
                  <label>{{ $t('enter_public_address') }}</label>
                  <textarea v-model="offline_address" rows="1" @input="validateAddress"/>
                </b-col>
                <!-- Account data view -->
                <b-col v-if="step==2 && !multisig" >
                  <b-row style="margin-bottom:10px;">
                    <b-col cols="6">
                      <h6>Wallet password</h6>
                    </b-col>
                    <b-col />
                  </b-row>
                  <b-row style="margin-bottom:20px;">
                    <b-col>Give a password to protect your wallet keys</b-col>
                  </b-row>
                  <div class="buttonInside">
                    <input v-model="wallet_pass_tmp" :type="password_visible ? 'text' : 'password'" @input="validatePassword" />
                    <span v-if="!password_correct" class="mnemonic-error">{{$t('error_password')}}</span>
                    <a class="inside" @click="toggletPasswordVisible">
                      <img v-if="password_visible" src="static/img/icons/eye-off.png" style="width:25px; opacity:0.2" />
                      <img v-else src="static/img/icons/eye-on.png" style="width:25px; opacity:0.2" />
                    </a>
                  </div>
                </b-col>
              </b-row>

              <b-row>
                <!-- Main button warning section -->
                <b-col>
                  <!-- Main button -->
                  <div class="d-flex justify-content-center">

                    <button class="btn btn-primary" @click="proceed" :disabled="!disabled">
                      <span>{{$t(workflow[step])}}</span>
                    </button>
                  </div>
                </b-col>
                <!-- <b-col cols="2" /> -->
              </b-row>
              <!-- Main button reset section -->
              <b-row v-if="step==1 || step==2" style="margin-top:4px">
                <!-- <b-col cols="2" /> -->
                <b-col style="text-align:center">
                  <a class="stealth-link" @click="onResetModal">
                    <span>reset all and restart from beginning</span>
                  </a>
                </b-col>
              </b-row>
              <b-row v-if="step==1" style="margin-top:4px">
                <!-- <b-col cols="2" /> -->
                <b-col style="text-align:center">
                  <a class="stealth-link" @click="onSwitchImportMode">
                    <span>Import wallet by {{import_modes[getOtherImportMode()]}}</span>
                  </a>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  BRow,
  BCol,
  BButton,
  BButtonGroup,
} from 'bootstrap-vue';
import {
  services
} from '@services/index';
import {
  createAddress
} from '@tendermint/sig';

export default {
  components: {
    BRow,
    BCol,
    BButtonGroup,
    BButton,
  },
  props: {
    modalId: {
      type: String,
      default: 'modalId',
    },
  },
  data() {
    return {
      workflow: ['Proceed', 'Import', 'Save'],
      step: 0,
      filter: 'no',
      filter_sort: 'yes',
      filter_offline: 'no',
      offline_wallet: false,
      offline_address:'',
      offline_address_correct:true,
      multisig: false,
      mnemonic: '',
      mnemonic_array: [],
      mnemonic_correct: true,
      private_key: "",
      private_key_correct: false,
      ms_address: '',
      ms_address_correct: false,
      require_ms_data: false,
      ms_address_threshold: '',
      ms_address_pubkeys: '',
      ms_address_pubkeys_sort: true,
      ms_pubkeys_base64_final: [],
      ms_data_correct: true,
      ms_data_pk_correct: false,
      ms_data_th_correct: false,
      wallet_name: '',
      wallet_pass_tmp: '',
      name_exists: false,
      name_correct: true,
      disabled: false,
      password: 'password',
      password_correct: true,
      password_visible: false,
      import_mode : 'm',
      import_modes:{
        m: "mnemonic",
        k: "private key"
      },
      buttons: [{
          caption: 'Yes',
          onPress: this.handleYes,
          filter: 'yes',
        },
        {
          caption: 'No',
          onPress: this.handleNo,
          filter: 'no',
        },
      ],
    };
  },
  methods: {
    onResetModal() {
      this.step = 0;
      this.filter = 'no';
      this.mnemonic = '';
      this.ms_address = '';
      this.private_key = '';
      this.wallet_name = '';
      this.offline_address ='';
      this.wallet_pass_tmp = '';
      this.disabled = false;
      this.multisig = false;
      this.name_exists = false;
      this.name_correct = true;
      this.require_ms_data = false;
      this.mnemonic_correct = false;
      this.password_correct = true;
      this.ms_data_pk_correct = false;
      this.ms_data_th_correct = false;
      this.private_key_correct = false;
      this.ms_address_pubkeys = '';
      this.ms_address_threshold = '';
      this.ms_pubkeys_base64_final = '';

      this.resetMnemonic()
    },
    getOtherImportMode(){
      return this.import_mode == 'm' ? 'k' : 'm'
    },
    onSwitchImportMode(){
      this.resetMnemonic()
      this.resetKey()

      this.import_mode = this.getOtherImportMode()
    },
    importWallet() {
      const formValue = {
        wallet_name: this.wallet_name,
        address: this.offline_address,
        mnemonic: this.mnemonic || null,
        private_key: this.private_key || null,
        wallet_pass_tmp: this.wallet_pass_tmp,
        multisig: false,
        offline: this.offline_wallet,
      };

      this.$emit('onImportWallet', formValue);
    },
    bech32ToPubkey(key) {
      const bech32 = require('bech32')
      let pubkeyAminoPrefix = Buffer.from('eb5ae98721', 'hex')
      let buffer = Buffer.from(bech32.fromWords(bech32.decode(key).words));
      return buffer.slice(pubkeyAminoPrefix.length)
    },
    bech32ToAdd(publickeyBech32) {
      const bech32 = require('bech32')
      return Buffer.from(bech32.fromWords(bech32.decode(createAddress(publickeyBech32, "ki")).words)).toString('hex');
    },
    importMultiSigWallet() {
      var ms_data_filled = this.ms_data_pk_correct && this.ms_data_th_correct;

      if (!this.require_ms_data || ms_data_filled) {

        if (ms_data_filled) {
            var pubkeys_base64_tmp = []

            // bech32 to base64
            for (var key of this.ms_address_pubkeys.split("\n")) {
              var k = this.bech32ToPubkey(key);
              var a = this.bech32ToAdd(k)
              pubkeys_base64_tmp.push([k.toString('base64'), a]);
            }

            // Sort pubkeys by their addresses
            if (this.ms_address_pubkeys_sort){
              pubkeys_base64_tmp.sort((a, b) => a[1].localeCompare(b[1]));
            }

            this.ms_pubkeys_base64_final = pubkeys_base64_tmp.map(function(x) {
              return x[0];
            });
          }

        const formValue = {
          wallet_name: this.wallet_name,
          ms_address: this.ms_address,
          wallet_pass_tmp: this.wallet_pass_tmp,
          multisig: true,
          threshold: this.ms_address_threshold,
          pubkeys: this.ms_pubkeys_base64_final,
        };
        this.$emit('onImportMultiSigWallet', formValue);
      } else {
        this.disabled = false;
      }
    },
    validatePassword() {
      if (!this.wallet_pass_tmp) {
        this.password_correct = false;
      } else {
        var ok_password = new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})',
        );
        if (!ok_password.test(this.wallet_pass_tmp)) {
          this.password_correct = false;
        } else {
          this.password_correct = true;
        }
      }
      this.disabled = this.password_correct

    },
    toggletPasswordVisible() {
      this.password_visible = !this.password_visible;
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
      this.disabled = this.name_correct && !this.name_exists;

    },
    validateWalltNameExist() {
      let wallet_list = this.wallet_name;

      if (localStorage.getItem('wallet_list')) {
        let wallet_list_old = localStorage.getItem('wallet_list').split(',');
        if (wallet_list_old.includes(wallet_list)) {
          this.name_exists = true;
        } else {
          this.name_exists = false;
        }
      }
      this.disabled = this.name_correct && !this.name_exists;
    },
    validateAddress() {
      if (!this.offline_wallet){
        if (!this.ms_address) {
          this.ms_address_correct = false;
        } else {
          if (this.ms_address.substring(0, 3) != "ki1" || this.ms_address.length != 41) {
            this.ms_address_correct = false;
          } else {
            this.ms_address_correct = true;
          }
        }
        this.disabled = this.ms_address_correct;
      }
      else{
        if (!this.offline_address) {
          this.offline_address_correct = false;
        } else {
          if (this.offline_address.substring(0, 3) != "ki1" || this.offline_address.length != 41) {
            this.offline_address_correct = false;
          } else {
            this.offline_address_correct = true;
          }
        }
        this.disabled = this.offline_address_correct;
      }

    },
    validateMsData() {
      // TODO: optimize

      if (!this.ms_address_threshold) {
        this.ms_data_th_correct = false
      } else {
        if (/^\+?[1-9]\d*$/.test(this.ms_address_threshold)) {
          this.ms_data_th_correct = true
        } else {
          this.ms_data_th_correct = false;
        }
      }

      if (!this.ms_address_pubkeys) {
        this.ms_data_pk_correct = false
      } else {


        var ms_address_pubkey_array = this.ms_address_pubkeys.split('\n')
        if (ms_address_pubkey_array[ms_address_pubkey_array.length - 1] == '') {
          ms_address_pubkey_array.pop();
        }

        if (ms_address_pubkey_array.length >= parseInt(this.ms_address_threshold)) {
          this.ms_data_pk_correct = true
        } else {
          this.ms_data_pk_correct = false;
        }
      }
      this.disabled = this.ms_data_pk_correct && this.ms_data_th_correct;
    },
    // Query the blockchain to check whether we should ask for ms data
    async checkAddressStatus() {
      const account = await services.auth.fetchAccount(this.ms_address)
      var account_pubkey = {}
      if (account.data.result.type == "cosmos-sdk/ContinuousVestingAccount" ||
       account.data.result.type == 'cosmos-sdk/DelayedVestingAccount') {
          account_pubkey = account.data.result.value.BaseVestingAccount.BaseAccount.public_key
      }
      else{
          account_pubkey = account.data.result.value.public_key
      }

      if (account_pubkey == null){
        return true
      }
      else{
        if (account_pubkey.type !="tendermint/PubKeyMultisigThreshold") {
          this.not_ms_address = true;
          return true
        }
      }

      this.ms_address_threshold = account_pubkey.value.threshold
      this.ms_pubkeys_base64_final = account_pubkey.value.pubkeys.map(function(x) {
        return x.value;
      });

      return false
    },
    validatePrivKey(){
      try {
        Buffer.from(this.private_key, 'hex')
        this.private_key_correct = true
      } catch (err) {
        this.private_key_correct = false
      }

      this.disabled = this.private_key != '' && this.private_key_correct ;
    },
    validateMnemonic(type) {
      let input = '';
      this.mnemonic = this.mnemonic_array.join(" ")

      if (type == 0) {
        input = this.mnemonic;
      }

      input = input.replace(/(^\s*)|(\s*$)/gi, '');
      input = input.replace(/[ ]{2,}/gi, ' ');
      input = input.replace(/\n /, '\n');

      let input_size = input.split(' ').length;

      if (input_size == 24) {
        this.mnemonic_correct = true;
      } else {
        this.mnemonic_correct = false;
      }

      this.disabled = this.mnemonic_correct
    },
    async proceed(e) {
      switch (this.step) {

        case 0:
          this.step++;
          this.disabled = false;
          break;

        case 1:
          if (this.offline_wallet){
            this.importWallet();
          }
          else{
            if (this.multisig) {
              this.require_ms_data = await this.checkAddressStatus()
              this.importMultiSigWallet()
            } else {
              this.step++;
              this.disabled = false;
            }
          }
          break;

        case 2:
          this.importWallet()
          break;
      }
    },
    handleYes(type) {
      if (type === "ms"){
        this.multisig = true;
        this.filter = 'yes';
      }
      if (type === "sort"){
        this.ms_address_pubkeys_sort = true;
        this.filter_sort = 'yes';
      }
      if (type === "offline"){
        this.offline_wallet = true;
        this.filter_offline = 'yes';
      }
    },
    handleNo(type) {
      if (type === "ms"){
        this.multisig = false;
        this.filter = 'no';
      }
      if (type === "sort"){
        this.ms_address_pubkeys_sort = false;
        this.filter_sort = 'no';
      }
      if (type === "offline"){
        this.offline_wallet = false;
        this.filter_offline = 'no';
        this.multisig = false;
        this.filter = 'no';
      }
    },
    parseMnemonic() {
      // simple message olive sheriff runway abstract fish twelve cause office claw debate edit window ancient mixture farm fury shell hard cruel abandon travel achieve
      this.mnemonic_array = this.mnemonic_array[0].split(" ")
      this.validateMnemonic(0);
    },
    resetMnemonic() {
      this.mnemonic_array = []
    },
    resetKey() {
      this.private_key = []
    }
  },
};
</script>

<style scoped>
.mnemonic-description {
  font-size: 14px;
  margin: 0px 0 8px;
  font-weight: bold;
  /* color: var(--darkbg) */
}

.mnemonic-form {
  text-align: left;
  font-size: 12px;
  line-height: 16px;
  margin: 10px 0 8px;
  font-weight: 400;
}

.warning-msg {
  margin: 0px 0 8px;
  color: var(--greyColor)
}

.contents input {
  display: block;
  font-size: 14px;
  border: none;
  width: 100%;
  padding: 2px;
}

input:focus {
  outline: none;
}

.contents .save ul {
  display: grid;
  grid-template-columns: 1fr;
  /* margin-bottom: 20px; */
  grid-column-gap: 20px;
  grid-row-gap: 30px;
}

.contents .phrases ul {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  /* margin-bottom: 20px; */
  grid-column-gap: 25px;
  grid-row-gap: 12px;
}

.contents .save ul li {
  color: var(--blueColor);
  font-size: 14px;
  border-bottom: 1px solid rgb(224, 224, 224);
  padding: 5px 0px;
}


.contents .phrases ul li {
  color: var(--blueColor);
  font-size: 14px;
  border-bottom: 1px solid rgb(224, 224, 224);
  padding: 5px 0px;
}


.contents .save ul li input {
  color: var(--darkbg);
  margin-left: 10px;
}

.contents .phrases ul li input {
  color: var(--darkbg);
  margin-left: 10px;
}

.stealth-link {
  /* margin: 25px; */
  font-size: 11px;
  color: var(--blueColor);
}

.mnemonic-form a:not([href]) {
  color: var(--blueColor);
}

.success-msg {
  text-align: center;
  font-size: 20px;
  color: var(--greenColor);
  margin-bottom: 50px;
  margin-top: 50px;

}

.optional-area {
  padding: 10px;
  margin-top: 20px;
  background-color: rgba(0, 0, 150, 0.1) !important;
  border: 1px solid rgb(224, 224, 224);
}
</style>