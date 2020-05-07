<template>
  <div class="d-flex w-100 h-100 justify-content-between align-items-center">
    <div>
      <h4>
        <span v-if="!loadingWallet">Total Balance</span>
        <span v-else>
          <b-spinner type="grow" variant="light" />
        </span>
      </h4>
    </div>
    <div class="d-flex flex-row">
      <div class="pr-4">
        <a
          role="button"
          data-toggle="modal"
          data-target="#add-form-topbar"
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <unicon name="plus-circle" :fill="colors.secondary" />
          <span class="mt-2" :style="{ fontWeight: '500' }">
            Create a Wallet
          </span>
        </a>
      </div>
      <div class="border-left pl-4">
        <a
          role="button"
          data-toggle="modal"
          data-target="#import-form-topbar"
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <unicon name="import" :fill="colors.secondary" />
          <span class="mt-2" :style="{ fontWeight: '500' }">
            Import a Wallet
          </span>
        </a>
      </div>
    </div>
    <!-- =======================Import modal============================= -->
    <ImportWalletForm
      modalId="import-form-topbar"
      @onImportWallet="handleImportWallet"
      @oImportMultiSigWallet="handleImportMultiSigWallet"
    />
    <!-- =======================Create modal============================= -->
    <CreateWalletForm
      modalId="add-form-topbar"
      @onImportCreatedWallet="handleImportWallet"
    />
  </div>
</template>

<script>
import { createWalletFromMnemonic } from '@tendermint/sig';
import ImportWalletForm from '@cmp/wallets/modals/import-wallet';
import CreateWalletForm from '@cmp/wallets/modals/create-wallet';
import * as AES from 'crypto-js/aes';
import { mapState } from 'vuex';
import { BSpinner } from 'bootstrap-vue';

export default {
  components: {
    ImportWalletForm,
    CreateWalletForm,
    BSpinner,
  },
  computed: {
    ...mapState({
      loadingWallet: state => state.wallets.loading,
    }),
  },
  data() {
    return {
      blockchain: 'KiChain',
      blockchain_lowercase: 'kichain',
      nodeUrl: '',
      network: '',
      token: '',
    };
  },
  mounted() {
    this.getChain();
  },
  methods: {
    getChain() {
      if (this.blockchain) {
        let blockchain = this.blockchain.toLowerCase();
        this.blockchain_lowercase = blockchain;
        this.nodeUrl = this.globalData[blockchain].nodeUrl;
        this.network = this.globalData[blockchain].network;
        this.token = this.globalData[blockchain].token;
        this.prefix = this.globalData[blockchain].prefix;
      }
    },
    handleImportMultiSigWallet(formValue) {
      const { wallet_name, wallet_pass_tmp, ms_address } = formValue;

      // Store Wallet
      this.storeInWalletList(wallet_name);

      localStorage.setItem(
        wallet_name,
        '{"privateKey":"","publicKey":{"type":"Buffer","data":[]},"address":"' +
          ms_address +
          '"}',
      );

      localStorage.setItem('import_success', 'true');

      window.location.reload();
    },
    handleImportWallet(formValue) {
      const { wallet_name, wallet_pass_tmp, mnemonic } = formValue;

      // Create the wallet
      const wallet = createWalletFromMnemonic(mnemonic, '', this.prefix);

      // Store Wallet
      this.storeInWalletList(wallet_name);

      console.log('AVANT :: ', wallet.privateKey);
      // Encrypt the private key
      var encrypted_key = AES.encrypt(
        wallet.privateKey.toString('hex'),
        wallet_pass_tmp,
      ).toString();
      wallet.privateKey = encrypted_key;
      console.log('APRES :: ', wallet.privateKey);

      // Save the encrypted wallet in the local storage
      localStorage.setItem(wallet_name, JSON.stringify(wallet));

      localStorage.setItem('import_success', 'true');

      window.location.reload();
    },

    storeInWalletList(wallet_name) {
      // Store the wallet name in the wallet name list if it doesnot already exist
      const list = localStorage.getItem('wallet_list');
      localStorage.setItem(
        'wallet_list',
        (list && wallet_name + ',' + list) || wallet_name,
      );
    },
  },
};
</script>

<style scoped>
h4 {
  color: white;
  font-weight: 700;
}
</style>
