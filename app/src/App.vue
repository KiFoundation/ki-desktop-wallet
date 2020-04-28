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
      <router-view />
    </template>
  </div>
</template>

<script>
import { BSpinner, BContainer, BRow } from 'bootstrap-vue';
import { mapMutations } from 'vuex';
import { SET_WALLETS_LIST } from '@store/wallets';
import { SET_ACCOUNT } from '@store/account';

export default {
  name: 'App',
  components: {
    BSpinner,
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
      transfer: {
        alert: '',
        account: '',
        amount: 0,
        token: 'tki',
        memo: '',
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
      },
      delegate: {
        alert: '',
        validator: '',
        amount: 0,
        token: 'tki',
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
      },
      undelegate: {
        alert: '',
        validator: '',
        amount: 0,
        token: 'tki',
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
      },
      redelegate: {
        alert: '',
        to_validator: '',
        from_validator: '',
        amount: 0,
        token: 'tki',
        fee: 0.00125,
        gasPrice: '0.0000005',
        gasLimit: 300000,
        output: '',
      },
      withdraw: {
        alert: '',
        validator_address: '',
        config: 0,
        output: '',
      },
      sign: {
        alert: '',
        file: '',
        file_valid: false,
        file_content: '',
        summary: '',
        signature: '',
        onbehalf: '',
      },
      multisign: {
        alert: '',
        file: '',
        file_valid: false,
        file_content: '',
        summary: '',
        signature: '',
        description: '',
        sigfiles: [],
        txfile_valid: false,
        fields: ['address', 'status'],
        threshold: 0,
        signed: {},
        pubkeys: [
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
          // {'address': 'ta3ta3ta3ta3ta3ta3ta3ta3ta3ta3', 'status': 'pending...'},
        ],
      },

      reward_config: [
        'rewards only',
        'commissions only',
        'rewards and commission',
      ],

      account_number: 0,
      sequence: 0,
      values: ['TKI'],
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
      this.isLoading = false;
    };
    bootstrap();
  },
  mounted() {},
  methods: {
    ...mapMutations({
      setWalletsList: SET_WALLETS_LIST,
      setAccount: SET_ACCOUNT,
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
          let identity_j = JSON.parse(identity);

          this.account = identity_j.account;
          this.accountName = identity_j.accountName;
          this.key = identity_j.privatekey;
          // console.log(new Buffer(this.key, 'hex').toString('utf8'))

          this.publickey = identity_j.publickey;
          this.chainId = identity_j.chainId;
          if (this.key == '') {
            this.multisig = true;
            this.context = 'Generate';
            this.advanced = false;
          }
          this.setAccount({
            name: identity_j.accountName,
            id: identity_j.account,
          });
        }
        res(1);
      });
    },
    getAccounts() {
      return new Promise(res => {
        if (localStorage.getItem('wallet_list')) {
          const wallets = [];
          let wallet_list = localStorage.getItem('wallet_list').split(',');
          for (var w in wallet_list) {
            wallets.push({
              account: wallet_list[w],
              address: JSON.parse(localStorage.getItem(wallet_list[w])).address,
              privatekey: Buffer.from(
                JSON.parse(localStorage.getItem(wallet_list[w])).privateKey,
              ).toString('hex'),
              publickey: Buffer.from(
                JSON.parse(localStorage.getItem(wallet_list[w])).publicKey,
              ).toString('hex'),
            });
          }
          this.setWalletsList(wallets);
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
