<template>
  <div id="app">
    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      :style="{ height: '100vh' }"
    >
      <BSpinner
        style="width: 3rem; height: 3rem; color: #0e41e1;"
        label="Large Spinner"
      />
    </div>
    <template v-else>
      <transition name="fade">
        <router-view />
      </transition>
    </template>
  </div>
</template>

<script>
import { BSpinner, BContainer, BRow } from 'bootstrap-vue';
import { mapMutations, mapState, mapActions } from 'vuex';
import { SET_WALLETS_LIST, SET_WALLETS_DICT } from '@store/wallets';
import { SET_ACCOUNT } from '@store/account';
import { FETCH_VALIDATORS_LIST } from '@/store/validators';

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
    };
  },
  created() {
    const bootstrap = async () => {
      await this.getChain();
      await this.getAccounts();
      await this.fetchValidatorsList();
      this.isLoading = false;
    };
    bootstrap();
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setWalletsList: SET_WALLETS_LIST,
      setWalletsDict: SET_WALLETS_DICT,
      setAccount: SET_ACCOUNT,
    }),
    ...mapActions({
      fetchValidatorsList: FETCH_VALIDATORS_LIST,
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
            // identity_j = JSON.parse(identity.replace(/undefined/g, "false"))
            res(0)
          }
          this.account = identity_j.account;
          this.accountName = identity_j.accountName;
          this.key = identity_j.privatekey;
          this.ms = identity_j.ms;

          this.publickey = identity_j.publickey;
          this.chainId = identity_j.chainId;
          if (this.ms) {
            this.multisig = true;
            this.context = 'Generate';
            this.advanced = false;
          }
        }
        res(1);
      });
    },
    getAccounts() {
      return new Promise(res => {
        if (localStorage.getItem('wallet_list')) {
          const wallets = [];
          const wallets_dict = {};
          let wallet_list = localStorage.getItem('wallet_list').split(',');
          for (var w in wallet_list) {

            var wallet_tmp = {
              account: wallet_list[w],
              address: JSON.parse(localStorage.getItem(wallet_list[w])).address,
              privatekey: JSON.parse(localStorage.getItem(wallet_list[w]))
                .privateKey,
              publickey: Buffer.from(
                JSON.parse(localStorage.getItem(wallet_list[w])).publicKey,
              ).toString('hex'),
              ms: JSON.parse(localStorage.getItem(wallet_list[w])).ms,
              offline: JSON.parse(localStorage.getItem(wallet_list[w])).offline,
            }

            if (wallet_tmp.ms) {
              wallet_tmp["threshold"] = JSON.parse(localStorage.getItem(wallet_list[w])).threshold
              wallet_tmp["pubkeys"] = JSON.parse(localStorage.getItem(wallet_list[w])).pubkeys
            }

            wallets.push(wallet_tmp);
            wallets_dict[JSON.parse(localStorage.getItem(wallet_list[w])).address] = wallet_list[w]
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
