<template>
<div id="app">
  <div v-if="isLoading" class="d-flex justify-content-center align-items-center" :style="{ height: '100vh' }">
    <BSpinner style="width: 3rem; height: 3rem; color: #0e41e1;" label="Large Spinner" />
  </div>
  <template v-else>
    <transition name="fade">
      <router-view />
    </transition>
  </template>
</div>
</template>

<script>
import {
  BSpinner,
  BContainer,
  BRow
} from 'bootstrap-vue';
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex';
import {
  SET_WALLETS_LIST,
  SET_WALLETS_DICT,
  SET_CATEGORY_LIST
} from '@store/wallets';
import {
  SET_ACCOUNT,
  GET_PRICE
} from '@store/account';
import {
  FETCH_VALIDATORS_LIST
} from '@/store/validators';

export default {
  name: 'App',
  components: {
    BSpinner,
  },
  computed: {
    ...mapState({
      currentWallet: state => state.wallets.current,
    }),
  },
  data() {
    return {
      blockchain: 'KiChain',
      isLoading: true,
      progress: {
        per: 50,
        min: 10,
        max: 100,
      },

      account_number: 0,
      sequence: 0,
      values: ['XKI'],
      coin: {
        cny: 0,
        usd: 0,
        krw: 0,
      },
      tokenPrice: {
        rmb: 0,
        usd: 0,
      },
      balances: {
        sum: 0,
        USD: 0,
        CNY: 0,
        KRW: 0,
        list: {
          available: 0,
          delegate: 0,
          undelegate: 0,
          locked: 0,
        },
      },
      validators: {},
      wallets: [],
      delegations: {},
      transactions: [],
      categories: '',
    };
  },
  created() {
    const bootstrap = async () => {
      await this.getChain();
      await this.getAccounts();
      await this.fetchValidatorsList();
      await this.getPrice();
      this.isLoading = false;
    };
    bootstrap();
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    ...mapMutations({
      setWalletsList: SET_WALLETS_LIST,
      setWalletsDict: SET_WALLETS_DICT,
      setAccount: SET_ACCOUNT,
      setCategoryList: SET_CATEGORY_LIST,
    }),
    ...mapActions({
      fetchValidatorsList: FETCH_VALIDATORS_LIST,
      getPrice: GET_PRICE,
    }),
    getChain() {
      return new Promise(async res => {
        if (this.blockchain) {
          let blockchain = this.blockchain.toLowerCase();
          this.blockchain_lowercase = blockchain;
          this.nodeUrl = this.globalData[blockchain].nodeUrl;
          this.network = this.globalData[blockchain].network;
          this.token = this.globalData[blockchain].token;
          this.prefix = this.globalData[blockchain].prefix;
        }

        const identity = localStorage.getItem('identity_kichain');

        if (identity) {
          let identity_j
          try {
            identity_j = JSON.parse(identity);
          } catch (e) {
            res(0)
          }
        }
        res(1);
      });
    },
    getCategories(){
      let categories = [];
      if (localStorage.getItem('categories')) {
        categories = localStorage.getItem('categories').split(',');
      }else{
        categories =  ['personal','work','multisignature','uncategorized']
        localStorage.setItem('categories', categories);
      }
      this.categories = categories.join(",");
      this.setCategoryList(categories);
    },
    getAccounts() {
      return new Promise(res => {
        if (localStorage.getItem('wallet_list')) {
          const wallets = [];
          const wallets_dict = {};
          let wallet_list = (localStorage.getItem('wallet_list')) ? localStorage.getItem('wallet_list').split(',') : '';

          for (var w in wallet_list) {
            let lse_temp;
            let valid = true;

            if (localStorage.getItem(wallet_list[w])) {

              try {
                lse_temp = JSON.parse(localStorage.getItem(wallet_list[w]))
                lse_temp.invalid = false
              } catch (e) {
                valid = false
              }

              try {
                if(localStorage.getItem(wallet_list[w]).includes(undefined)){
                  // Work around to fix the corrupted local storage from previous version
                  lse_temp = JSON.parse(localStorage.getItem(wallet_list[w]).replace(/undefined/g, false))
                  lse_temp.invalid = true
                  valid = true
                }
              } catch (e) {
              }

              if (valid){
                var wallet_tmp = {
                  account: wallet_list[w],
                  address: lse_temp.address,
                  privatekey: lse_temp.privateKey,
                  publickey: Buffer.from(lse_temp.publicKey, ).toString('hex'),
                  ms: lse_temp.ms,
                  offline: lse_temp.offline,
                  invalid: lse_temp.invalid,
                  category: (lse_temp.category != undefined && this.categories.includes(lse_temp.category)) ? lse_temp.category : "uncategorized"
                }

                if (wallet_tmp.ms) {
                  wallet_tmp["threshold"] = lse_temp.threshold
                  wallet_tmp["pubkeys"] = lse_temp.pubkeys
                }

                wallets.push(wallet_tmp);
                wallets_dict[lse_temp.address] = wallet_list[w]
              }
            }
          }
          this.setWalletsList(wallets);
          this.setWalletsDict(wallets_dict);
          res(1);
        } else {
          res(0);
        }
      });
    },


  },
};
</script>

<style></style>
