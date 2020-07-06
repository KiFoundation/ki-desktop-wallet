<template>
<div :id="modalId" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="importLongTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="importTitle" class="modal-title">
          {{ $t('webwallet_create_title') }}
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="onResetModal">
          <span aria-hidden="true" style="color:white;">&times;</span>
        </button>
      </div>

      <div class="basic-form modal-body">
        <div class="mnemonic-group">
          <div class="mnemonic-form">

            <div v-if="step==0">
              <b-row style="margin-bottom:10px;">
                <b-col cols="6">
                  <h5>Wallet name</h5>
                </b-col>
                <b-col />
              </b-row>
              <b-row style="margin-bottom:20px;">
                <b-col>Give a name to your wallet to distinguish it in the wallet list</b-col>
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
            </div>
          </div>

          <!-- <div v-if="generated"> -->
          <div style="margin-bottom:20px">
            <div class="mnemonic-form">
              <b-row v-if="step!=0" style="margin-bottom:10px">
                <!-- <b-col cols="2" /> -->
                <!-- Mnemonic views -->
                <b-col v-if="step==1 || step==2">
                  <b-row style="margin-bottom:10px;">
                    <b-col cols="6">
                      <h5>Your mnemonic</h5>
                    </b-col>
                    <b-col />
                    <b-col style="text-align:right" cols="4">
                      <a class="stealth-link" @click="step=1;generateWallet()">Generate new</a>
                    </b-col>
                  </b-row>
                  <b-row style="margin-bottom:20px;">
                    <b-col v-if="step==1">Write down this mnemonic before you proceed</b-col>
                    <b-col v-if="step==2">Fill in the missing words to complete the verification <a @click="switchVerficatioMode">
                        <span v-if="easy">
                          <img id="easy-target" src="static/img/icons/lightning-easy.png" style="width:20px; opacity:0.7" />
                          <b-tooltip target="easy-target" triggers="hover">
                            Switch to hard mode.
                          </b-tooltip>
                        </span>
                        <span v-else>
                          <img id="hard-target" src="static/img/icons/lightning.png" style="width:20px; opacity:0.8" />
                          <b-tooltip target="hard-target" triggers="hover">
                            Switch to easy mode.
                          </b-tooltip>
                        </span>

                      </a></b-col>

                  </b-row>

                  <div class="contents">
                    <!-- Generated mnemonic array -->
                    <div v-if="step==1" class="phrases">
                      <ul>
                        <li v-for="(item, idx) in mnemonic_array" v-bind:key="'w'+idx">
                          <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                            <label style="margin:0px;" :for="'w'+idx">{{idx+1}}.</label> <input :id="'w'+idx" type="text" v-model="mnemonic_array[idx]" />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <!-- Generated mnemonic array - verify -->
                    <div v-if="step==2" class="phrases">
                      <ul>
                        <li v-for="(item, idx) in mnemonic_array_sub" :ref="'ws'+idx" v-bind:key="'ws'+idx">
                          <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
                            <label style="margin:0px;" :for="'ws'+idx">{{idx+1}}.</label> <input :id="'ws'+idx" type="text" v-model="mnemonic_array_sub[idx]" />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </b-col>
                <!-- Account data view -->
                <b-col v-if="step==4">
                  <b-row style="margin-bottom:10px;">
                    <b-col cols="6">
                      <h5>Wallet password</h5>
                    </b-col>
                    <b-col />
                  </b-row>
                  <b-row style="margin-bottom:20px;">
                    <b-col>Give a password to protect your wallet keys</b-col>
                  </b-row>
                  <div class="buttonInside">
                    <input v-model="wallet_pass_tmp" :type="password_visible ? 'text' : 'password'" @input="validatePassword" />
                    <span v-if="!password_correct" class="mnemonic-error">{{
                  $t('error_password')
                }}</span>
                    <a class="inside" @click="toggletPasswordVisible">
                      <img v-if="password_visible" src="static/img/icons/eye-off.png" style="width:25px; opacity:0.2" />
                      <img v-else src="static/img/icons/eye-on.png" style="width:25px; opacity:0.2" />
                    </a>
                  </div>
                </b-col>

              </b-row>

              <!-- Main button section -->
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
                  <a class="stealth-link" @click="onResetModal; step=0">
                    <span>reset all and restart from beginning</span>
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
  KeyPair,
  signTx,
  verifyTx,
  createWalletFromMnemonic,
  createBroadcastTx,
} from '@tendermint/sig';

import {
  BTooltip
} from 'bootstrap-vue';

import * as bip39 from 'bip39';

export default {
  components: {
    BTooltip
  },
  props: {
    modalId: {
      type: String,
      default: 'modalId',
    },
  },
  data() {
    return {
      easy: false,
      workflow: ['generate', 'proceed', 'verify', 'end', 'save'],
      step: 0,
      mnemonic_create: '',
      mnemonic_array: [],
      mnemonic_array_sub: [],
      wallet_name: '',
      name_exists: false,
      name_correct: true,
      disabled: false,
      password_visible: false,
      password_correct: true,
      wallet_pass_tmp: '',
      wallet: null,
    };
  },
  methods: {
    onResetModal() {
      this.step = 0;
      this.wallet_name = '';
      this.wallet_pass_tmp = '';
      this.mnemonic_array = [];
      this.mnemonic_array_sub = [];
      this.mnemonic_create = '';
      this.disabled = false;
      this.generated = false;
      this.name_exists = false;
      this.name_correct = true;
      this.password_correct = true;
      // this.$emit('onResetModal');
    },

    importWallet() {
      const formValue = {
        wallet_name: this.wallet_name,
        wallet_pass_tmp: this.wallet_pass_tmp,
        mnemonic: this.mnemonic_create,
      };
      this.$emit('onImportCreatedWallet', formValue);
    },

    toggletPasswordVisible() {
      this.password_visible = !this.password_visible;
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

    generateWallet() {
      this.mnemonic_create = bip39.generateMnemonic(256);
      this.mnemonic_array = this.mnemonic_create.split(" ")
      this.switchVerficatioMode();
    },

    switchVerficatioMode() {
      this.easy = !this.easy
      var subed = [];
      var words_to_remove = this.easy ? 6 : 24;

      this.mnemonic_array_sub = [...this.mnemonic_array]

      while (subed.length < words_to_remove) {
        var r = Math.floor(Math.random() * 24);
        if (subed.indexOf(r) === -1) {
          this.mnemonic_array_sub[r] = "";
          subed.push(r);
        };
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

      this.disabled = this.name_correct & !this.name_exists;

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

      this.disabled = this.name_correct & !this.name_exists;

    },

    verify() {
      var difference = this.mnemonic_array.filter(x => this.mnemonic_array_sub.indexOf(x) === -1);
      var ok = this.mnemonic_array.filter(x => this.mnemonic_array_sub.indexOf(x) != -1);

      ok.forEach(x => {
        if (this.mnemonic_array.indexOf(x) === this.mnemonic_array_sub.indexOf(x)) {
          let ref = 'ws' + this.mnemonic_array.indexOf(x)
          this.$refs[ref][0].style.borderBottomColor = 'rgb(224, 224, 224)'
        }
      })

      difference.forEach(x => {
        let ref = 'ws' + this.mnemonic_array.indexOf(x)
        this.$refs[ref][0].style.borderBottomColor = 'red'
      })

      return this.mnemonic_array_sub.join(' ') == this.mnemonic_array.join(' ')
    },

    proceed(e) {
      switch (this.step) {

        case 0:
          this.generateWallet();
          this.step++;
          break;

        case 1:
          this.step++;
          break;

        case 2:
          if (this.verify()) {
            this.step += 2;
          }
          break;

        case 3:
          this.eraseKey();
          this.step++;
          break;

        case 4:
          this.importWallet()
          break;
      }
    },
  },
};
</script>

<style scoped>

.mnemonic-description{
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

.warning-msg{
  margin: 0px 0 8px;
  color: var(--greyColor)
}

.contents input{
  display: block;
  font-size: 14px;
  border: none ;
  width: 100%;
  padding: 2px;
}

input:focus{
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

.contents .save ul li{
    color: var(--blueColor);
    font-size: 14px;
    border-bottom: 1px solid rgb(224, 224, 224);
    padding: 5px 0px;
  }


.contents .phrases ul li{
    color: var(--blueColor);
    font-size: 14px;
    border-bottom: 1px solid rgb(224, 224, 224);
    padding: 5px 0px;
  }


.contents .save ul li input{
    color: var(--darkbg);
    margin-left: 10px;
}

.contents .phrases ul li input{
    color: var(--darkbg);
    margin-left: 10px;
}

.stealth-link{
  /* margin: 25px; */
  font-size: 11px;
  color: var(--blueColor);
}

.mnemonic-form a:not([href]) {
  color: var(--blueColor);
}

.success-msg{
  text-align:center;
  font-size:20px;
  color: var(--greenColor);
  margin-bottom: 50px;
  margin-top: 50px;

}</style>
