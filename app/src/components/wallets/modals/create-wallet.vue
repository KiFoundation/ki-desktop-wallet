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
            {{ $t('webwallet_create_title') }}
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

        <div class="basic-form modal-body">
          <!-- <img src="static/img/chain/kichain_banner.png" style="width:70%" class="card-img-top"> -->
          <div class="mnemonic-group">
            <li>
              <label>{{ $t('enter_wallet_name') }}</label>
              <input
                v-model="wallet_name"
                type="text"
                @input="
                  validateWalltName();
                  validateWalltNameExist();
                "
              />
              <span v-if="!name_correct" class="mnemonic-error">{{
                $t('error_wallet_name')
              }}</span>
              <span v-if="name_correct && name_exists" class="mnemonic-error">
                {{ $t('error_wallet_name_exists') }}
              </span>

              <div v-if="generated">
                <label>{{ $t('save_mnemonic') }}</label>
                <textarea
                  v-model="mnemonic_create"
                  rows="4"
                  readonly
                  @change="validateMnemonic(1)"
                />

                <label>{{ $t('create_password') }}</label>
                <div class="buttonInside">
                  <input
                    v-model="wallet_pass_tmp"
                    :type="password_visible ? 'text' : 'password'"
                    @input="validatePassword"
                  />
                  <span v-if="!password_correct" class="mnemonic-error">{{
                    $t('error_password')
                  }}</span>
                  <a class="inside" @click="toggletPasswordVisible">
                    <img
                      v-if="password_visible"
                      src="static/img/icons/eye-off.png"
                      style="width:25px; opacity:0.2"
                    />
                    <img
                      v-else
                      src="static/img/icons/eye-on.png"
                      style="width:25px; opacity:0.2"
                    />
                  </a>
                </div>
              </div>
            </li>
          </div>
          <div class="d-flex justify-content-center">
            <button
              v-if="!generated"
              type="button"
              class="btn btn-primary"
              :disabled="!this.wallet_name"
              @click="
                generateWallet();
                validateMnemonic(1);
              "
            >
              Generate
            </button>
            <button
              v-else
              type="button"
              class="btn btn-primary"
              :disabled="!disabled"
              @click="importWallet"
            >
              Import
            </button>
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
import * as bip39 from 'bip39';

export default {
  props: {
    modalId: {
      type: String,
      default: 'modalId',
    },
  },
  data() {
    return {
      mnemonic_create: '',
      mnemonic_correct: false,
      wallet_name: '',
      name_exists: false,
      name_correct: true,
      disabled: false,
      generated: false,
      password_visible: false,
      password_correct: true,
      wallet_pass_tmp: '',
      wallet: null,
    };
  },
  methods: {
    onResetModal() {
      this.wallet_name = '';
      this.wallet_pass_tmp = '';
      this.mnemonic_create = '';
      this.mnemonic_correct = true;
      this.disabled = false;
      this.generated = false;
      this.name_exists = false;
      this.name_correct = true;
      this.password_correct = true;
      this.$emit('onResetModal');
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
      this.disabled =
        this.mnemonic_correct &&
        this.name_correct &&
        this.password_correct &&
        !this.name_exists;

      if (!this.wallet_name || !this.mnemonic_create || !this.wallet_pass_tmp) {
        this.disabled = false;
      }
    },
    generateWallet() {
      this.mnemonic_create = bip39.generateMnemonic(256);
      this.generated = true;
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
      this.disabled =
        this.mnemonic_correct &&
        this.name_correct &&
        this.password_correct &&
        !this.name_exists;

      if (!this.wallet_name || !this.mnemonic_create || !this.wallet_pass_tmp) {
        this.disabled = false;
      }
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

      this.disabled =
        this.mnemonic_correct &&
        this.name_correct &&
        this.password_correct &&
        !this.name_exists;

      if (!this.wallet_name || !this.mnemonic_create || !this.wallet_pass_tmp) {
        this.disabled = false;
      }
    },
    validateMnemonic(type) {
      let input = '';
      if (type == 1) {
        input = this.mnemonic_create;
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

      this.disabled =
        this.mnemonic_correct &&
        this.name_correct &&
        this.password_correct &&
        !this.name_exists;

      if (!this.wallet_name || !this.mnemonic_create || !this.wallet_pass_tmp) {
        this.disabled = false;
      }
    },
  },
};
</script>

<style scoped></style>
