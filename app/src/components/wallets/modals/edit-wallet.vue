<template>
<div :id="modalId" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="importLongTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document" style="width:500px">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="onResetModal">
          <span aria-hidden="true" >&times;</span>
        </button>
      </div>

      <div class="basic-form modal-body">
        <div class="mnemonic-group">
          <div class="modal-header" >
             <h5 id="importTitle" class="modal-title">
              {{ $t('webwallet_edit_title') }}
            </h5>
          </div>
          <div class="mnemonic-form">
            <div v-if="step==0">
              <b-row style="margin-bottom:10px;">
                <b-col cols="10">
                  <h6>Wallet name</h6>
                </b-col>
                <b-col />
              </b-row>
              <b-row style="margin-bottom:20px;">
                <b-col>Change the name of wallet </b-col>
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
                <b-col cols="10">
                  <h6>Category</h6>
                </b-col>
                <b-col />
              </b-row>
              <b-row style="margin-bottom:15px;" align-v="center">
                <b-col cols="10">{{ $t('wallet_category') }}</b-col>
              </b-row>
              <b-button v-for="(btn, idx) in buttons" size="sm" :key="idx" :pressed="filter === btn.filter" variant="outline-primary" style="margin-right:5px;margin-top:5px;" @click="btn.onPress(btn.filter)">
                {{ btn.caption }}
              </b-button>

              <b-row style="margin-bottom:10px;margin-top:20px;">
                <b-col cols="10">
                  <h6>Delete this wallet</h6>
                </b-col>
                <b-col />
              </b-row>

              <b-row style="margin-bottom:20px;">
                <b-col>Enter the name of the wallet you want to delete to confirm </b-col>
              </b-row>
              <input v-model="wallet_name" type="text" @input="
                    validateWalltName();
                    validateWalltNameExist();
                  "
                  class="danger"/>
                </div>
          </div>
          <div style="margin-bottom:20px">
            <div class="mnemonic-form">
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
} from 'bootstrap-vue';

export default {
  components: {
    BRow,
    BCol,
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
      workflow: ['Save'],
      step: 0,
      filter: 'u',
      wallet_name: '',
      name_exists: false,
      name_correct: true,
      disabled: false,

      buttons: [
        {
          caption: 'Personal',
          onPress: this.handleCat,
          filter: 'p',
        },
        {
          caption: 'Work',
          onPress: this.handleCat,
          filter: 'w',
        },
        {
          caption: 'Multisignature',
          onPress: this.handleCat,
          filter: 'm',
        },
        {
            caption: 'Uncategorized',
            onPress: this.handleCat,
            filter: 'u',
          },
      ],
    };
  },
  methods: {
    onResetModal() {
      this.step = 0;
      this.filter = 'u';
      this.mnemonic = '';
      this.ms_address = '';
      this.wallet_name = '';
      this.offline_address ='';
      this.wallet_pass_tmp = '';
      this.disabled = false;
      this.multisig = false;
      this.name_exists = false;
      this.name_correct = true;
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

    async proceed(e) {
    },

    handleCat(cat) {
        this.filter = cat;
    },
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