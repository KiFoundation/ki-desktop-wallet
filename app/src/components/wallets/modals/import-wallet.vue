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
            {{ $t('webwallet_import_title') }}
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
          <!-- <img src="static/img/chain/kichain_banner.png"  style="width:70%" class="card-img-top"> -->
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

              <b-row>
                <b-col cols="3" />
                <b-col cols="5" style="padding-left:0px; padding-right:0px;">
                  <label>{{ $t('multisig_wallet_true') }}</label>
                </b-col>
                <b-col style="padding-left:0px; padding-right:0px;" cols="1">
                  <div>
                    <toggle-button
                      v-model="multisig"
                      color="#043bea"
                      :height="18"
                      :width="35"
                      :sync="true"
                    />
                  </div>
                </b-col>
                <b-col cols="3" />
              </b-row>

              <div v-if="!multisig">
                <label>{{ $t('enter_mnemonic') }}</label>
                <textarea
                  v-model="mnemonic"
                  rows="4"
                  @input="validateMnemonic(0)"
                />
                <span v-if="!mnemonic_correct" class="mnemonic-error">{{
                  $t('error_mnemonic')
                }}</span>

                <label>{{ $t('create_password') }}</label>
                <div class="buttonInside">
                  <input
                    v-model="wallet_pass_tmp"
                    :type="password"
                    @input="validatePassword"
                  />
                  <span v-if="!password_correct" class="mnemonic-error">{{
                    $t('error_password')
                  }}</span>
                  <a
                    v-if="password == 'password'"
                    class="inside"
                    @click="password = 'text'"
                  >
                    <img
                      src="static/img/icons/eye-on.png"
                      style="width:25px; opacity:0.2"
                    />
                  </a>

                  <a
                    v-if="password == 'text'"
                    class="inside"
                    @click="password = 'password'"
                  >
                    <img
                      src="static/img/icons/eye-off.png"
                      style="width:25px; opacity:0.2"
                    />
                  </a>
                </div>
              </div>
              <div v-if="multisig">
                <label>{{ $t('enter_public_address') }}</label>
                <textarea v-model="ms_address" rows="2" />
                <!-- <span class="mnemonic-error" v-if="!ms_address_correct">{{$t('error_mnemonic')}}</span> -->
              </div>
            </li>
          </div>
          <div class="d-flex justify-content-center">
            <button
              v-if="!multisig"
              type="button"
              class="btn btn-primary"
              :disabled="!disabled"
              data-dismiss="modal"
              @click="importWallet"
            >
              Import
            </button>
            <button
              v-if="multisig"
              type="button"
              class="btn btn-primary"
              :disabled="!name_correct || name_exists || wallet_name == ''"
              data-dismiss="modal"
              @click="importMultiSigWallet"
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
import { BRow, BCol } from 'bootstrap-vue';
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
      multisig: false,
      mnemonic: '',
      mnemonic_correct: false,
      ms_address: '',
      ms_address_correct: false,
      wallet_name: '',
      wallet_pass_tmp: '',
      name_exists: false,
      name_correct: true,
      disabled: false,
      password: 'password',
      password_correct: true,
    };
  },
  methods: {
    onResetModal() {
      this.mnemonic = '';
      this.ms_address = '';
      this.wallet_name = '';
      this.wallet_pass_tmp = '';
      this.disabled = false;
      this.name_exists = false;
      this.name_correct = true;
      this.mnemonic_correct = false;
      this.password_correct = true;
      this.$emit('onResetModal');
    },
    importWallet() {
      const formValue = {
        wallet_name: this.wallet_name,
        mnemonic: this.mnemonic,
        wallet_pass_tmp: this.wallet_pass_tmp,
        multisig: false,
      };
      this.$emit('onImportWallet', formValue);
    },
    importMultiSigWallet() {
      const formValue = {
        wallet_name: this.wallet_name,
        ms_address: this.ms_address,
        wallet_pass_tmp: this.wallet_pass_tmp,
        multisig: true,
      };
      this.$emit('onImportMultiSigWallet', formValue);
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

      if (!this.wallet_name || !this.mnemonic || !this.wallet_pass_tmp) {
        this.disabled = false;
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
      this.disabled =
        this.mnemonic_correct &&
        this.name_correct &&
        this.password_correct &&
        !this.name_exists;

      if (!this.wallet_name || !this.mnemonic || !this.wallet_pass_tmp) {
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

      if (!this.wallet_name || !this.mnemonic || !this.wallet_pass_tmp) {
        this.disabled = false;
      }
    },
    validateMnemonic(type) {
      let input = '';
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

      this.disabled =
        this.mnemonic_correct &&
        this.name_correct &&
        this.password_correct &&
        !this.name_exists;

      if (!this.wallet_name || !this.mnemonic || !this.wallet_pass_tmp) {
        this.disabled = false;
      }
    },
  },
};
</script>

<style scoped></style>
