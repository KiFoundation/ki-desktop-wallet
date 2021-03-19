<template>
<div :id="modalId" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="importLongTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document" style="width:500px">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="onResetModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="basic-form modal-body">
        <div class="mnemonic-group">
          <div class="modal-header">
            <h5 id="importTitle" class="modal-title">
              {{ $t('webwallet_edit_title') }}
              <strong :style="{ fontWeight: '600' }">{{
                wallet.account
              }}</strong>
            </h5>
            <img src="static/img/icons/delete.png" width="28px" class="delete" @click="deleteWallet" />
          </div>
          <div class="mnemonic-form">
            <div v-if="step==0">
              <b-row style="margin-bottom:10px;">
                <b-col cols="10">
                  <h6>Wallet address</h6>
                </b-col>

              </b-row>
              <b-row style="margin-bottom:20px;">
                <b-col ref="walladd"  cols="10">
                    {{ wallet.address }}
                </b-col>
                <b-col  style="text-align:right">
                  <a @click="copy(wallet.address)" width="15px">copy</a>
                </b-col>
              </b-row>
              <b-row style="margin-bottom:10px;">
                <b-col cols="10">
                  <h6>Wallet name</h6>
                </b-col>
                <b-col />
              </b-row>
              <b-row style="margin-bottom:20px;">
                <b-col>Change the name of wallet </b-col>
              </b-row>
              <input v-model="new_wallet_name" type="text" @input="
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
                  <h6>Categories
                  </h6>
                </b-col>
                <b-col style="text-align:right">
                  <a @click=" workflow_cat[editing].onPress(), editing = !editing">{{workflow_cat[editing].label}}</a>
                </b-col>
              </b-row>
              <b-row style="margin-bottom:15px;" align-v="center">
                <b-col cols="10">{{ $t('wallet_category') }}</b-col>
              </b-row>
              <b-row align-v="center">
                <b-col v-if="!editing">
                  <b-button v-for="(cat, idx) in categories_.split(',')" size="sm" :key="idx" :pressed="filter === cat" variant="outline-primary" style="margin-right:5px;margin-top:5px;" @click="handleCat(cat)">
                    {{ cat }}
                  </b-button>
                </b-col>
                <b-col v-else>
                  <input v-model="categories_" type="text" />
                </b-col>
              </b-row>
            </div>
          </div>
          <div style="margin-bottom:20px">
            <div class="mnemonic-form">
              <b-row>
                <b-col>
                  <div class="d-flex justify-content-center">
                    <button class="btn btn-primary" @click="updateWallet" :disabled="editing || !disabled">
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
  BButton
} from 'bootstrap-vue';
import {
  mapState,
  mapMutations,
} from 'vuex';
import {
  SET_CATEGORY_LIST
} from '@store/wallets';

export default {
  components: {
    BRow,
    BCol,
    BButton
  },
  props: {
    modalId: {
      type: String,
      default: 'modalId',
    },
    wallet: {
      type: Object,
      default: null,
    }
  },

  data() {
    return {
      workflow: ['Save'],
      workflow_cat: {
        false: {
          label: 'edit',
          onPress: function(){},
        },
        true: {
          label: 'save',
          onPress: this.editCategories
        }
      },
      categories_ : "",
      step: 0,
      editing: false,
      new_wallet_name: this.wallet.account,
      new_wallet_categroy: this.wallet.category,
      filter: this.wallet.category,
      name_exists: false,
      name_correct: true,
      disabled: true,
      wallet_name_to_delete: '',
    };
  },
  computed: {
    ...mapState({
      categories: state => state.wallets.categories,
    }),
  },
  mounted(){
    this.categories_ = this.categories.join(',')
  },
  methods: {
    ...mapMutations({
      setCategoryList: SET_CATEGORY_LIST,
    }),
    onResetModal() {
      this.step = 0;
      this.new_wallet_name = this.wallet.account;
      this.new_wallet_categroy = this.wallet.category;
      this.disabled = true;
      this.editing=false;
      this.name_exists = false;
      this.name_correct = true;
    },
    validateWalltName() {
      if (!this.new_wallet_name) {
        this.name_correct = false;
      } else {
        if (this.new_wallet_name.match(/[^\w\.\-]/)) {
          this.name_correct = false;
        } else {
          this.name_correct = true;
        }
      }
      this.disabled = this.name_correct && !this.name_exists;

    },
    validateWalltNameExist() {
      let wallet_list = this.new_wallet_name;

      if (wallet_list == this.wallet.account) {
        this.name_exists = false;
      } else {
        if (localStorage.getItem('wallet_list')) {
          let wallet_list_old = localStorage.getItem('wallet_list').split(',');
          if (wallet_list_old.includes(wallet_list)) {
            this.name_exists = true;
          } else {
            this.name_exists = false;
          }
        }
      }

      this.disabled = this.name_correct && !this.name_exists;
    },
    handleCat(cat) {
      this.filter = cat;
      this.new_wallet_categroy = cat;
    },
    editCategories() {
      var categories_a = this.categories_.split(',')
      if (!this.categories_.includes("uncategorized")){
        categories_a.push("uncategorized")
      }
      localStorage.setItem('categories', categories_a)
      this.setCategoryList(categories_a)
    },
    updateWallet() {
      var updated_wallet = JSON.parse(localStorage.getItem(this.wallet.account))

      if (this.new_wallet_categroy != this.wallet.category) {
        updated_wallet["category"] = this.new_wallet_categroy
      }

      localStorage.setItem(this.new_wallet_name, JSON.stringify(updated_wallet))

      if (this.new_wallet_name != this.wallet.account) {
        localStorage.removeItem(this.wallet.account)
        var old_list = localStorage.getItem("wallet_list").split(',')
        var index = old_list.indexOf(this.wallet.account);

        if (index !== -1) {
            old_list[index] = this.new_wallet_name;
        }

        var new_list = old_list.join(',')

        localStorage.setItem("wallet_list", new_list)
      }
      this.$emit('onUpdateSuccess');
    },
    deleteWallet() {
      if (confirm("Do you really want to delete " + this.wallet.account + " ?")) {
        localStorage.removeItem(this.wallet.account)
        var wallet_list_tmp = (localStorage.getItem("wallet_list")) ? localStorage.getItem("wallet_list").split(',') : '';
        var index = wallet_list_tmp.indexOf(this.wallet.account);

        if (index > -1) {
          wallet_list_tmp.splice(index, 1);
        }
        if (wallet_list_tmp.length == 0) {
          localStorage.setItem("identity_kichain", "")
          localStorage.setItem("current_wallet", "")
        }
        localStorage.setItem("wallet_list", wallet_list_tmp.join(","))
        window.location.reload();
      }
    },
    copy(value){
      navigator.clipboard.writeText(value)
        .then(() => {
          this.$bvToast.toast("Address copied" , {
            variant: 'success',
            autoHideDelay: 2000,
            noCloseButton: true,
            solid: true,
            toaster: 'b-toaster-bottom-center',
          });
        })
        .catch(err => {
          // This can happen if the user denies clipboard permissions:
          console.error('Could not copy text: ', err);
        });
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

.delete {
  opacity: 0.2
}

.delete:hover {
  opacity: 0.5
}

</style>