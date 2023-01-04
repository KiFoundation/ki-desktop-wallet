<template>
  <div class="d-flex w-100 h-100 justify-content-between align-items-center">
    <div class="d-flex justify-content-center flex-column ml-3" v-if="!loadingWallet">
      <h5>Total Balance</h5>
      <h4>
        <span  :style="{ fontWeight: '800' }">{{total}} </span>
        <span :style="{ fontWeight: '400' }">{{ globalData.kichain.token }}</span>
      </h4>
      <p
        :style="{
          color: 'var(--secondary)',
          fontSize: '0.9rem',
          fontWeight: '600',
        }"
      >

      ≈ ${{total_usd}}  (${{token_price}}/{{ globalData.kichain.token }})
      </p>

    </div>
    <span v-else>
      <b-spinner type="grow" variant="light" />
    </span>
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
      @onImportMultiSigWallet="handleImportMultiSigWallet"
    />
    <!-- =======================Create modal============================= -->
    <CreateWalletForm
      modalId="add-form-topbar"
      @onImportCreatedWallet="handleImportWallet"
    />
  </div>
</template>

<script>
import { createWalletFromMnemonic, createAddress } from '@tendermint/sig';
import ImportWalletForm from '@cmp/wallets/modals/import-wallet';
import CreateWalletForm from '@cmp/wallets/modals/create-wallet';
import * as AES from 'crypto-js/aes';
import { mapState } from 'vuex';
import { BSpinner } from 'bootstrap-vue';
import { services } from '@services/index';
import { tokenUtil } from '@static/js/token';
import {
    publicKeyCreate as secp256k1PublicKeyCreate,
} from 'secp256k1';

export default {
  components: {
    ImportWalletForm,
    CreateWalletForm,
    BSpinner,
  },
  computed: {
    ...mapState({
      loadingWallet: state => state.wallets.loading,
      wallets: state => state.wallets.list,
      token_price_raw: state => state.price,
    }),
  },
  data() {
    return {
      blockchain: 'KiChain',
      blockchain_lowercase: 'kichain',
      nodeUrl: '',
      network: '',
      token: '',
      total:0,
      total_usd:0,
      token_price: 0.00
    };
  },
  mounted() {
    this.getChain();
    this.getTotalBalance();
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
      const { wallet_name, wallet_pass_tmp, ms_address, threshold, pubkeys, multisig } = formValue;

      // Store Wallet
      this.storeInWalletList(wallet_name);

      localStorage.setItem(
        wallet_name,
        '{ "offline":' + false + ',"ms":' + multisig + ',\
        "privateKey":"","publicKey":{"type":"Buffer","data":[]},\
        "address":"' + ms_address + '",\
        "threshold":"'+ threshold + '",\
        "pubkeys":' + JSON.stringify(pubkeys) + '}',
      );

      localStorage.setItem('import_success', 'true');
      window.location.reload();
    },
    handleImportWallet(formValue) {
      const { wallet_name, wallet_pass_tmp, mnemonic, private_key, multisig, offline, address} = formValue;

      var wallet = {}
      var priv_key = ''

      if ( mnemonic != null &&  private_key == null){
        // Create the wallet
        const wallet_temp = createWalletFromMnemonic(mnemonic, '', this.prefix);
        wallet = wallet_temp
        priv_key = wallet.privateKey.toString('hex')
      }

      if ( mnemonic == null &&  private_key != null){
        priv_key = private_key
        wallet.publicKey = secp256k1PublicKeyCreate(Buffer.from(private_key, 'hex'), true);
        wallet.address = createAddress(wallet.publicKey, this.prefix);
      }

      // Store Wallet
      this.storeInWalletList(wallet_name);

      // Encrypt the private key
      if (!offline){
        var encrypted_key = AES.encrypt(
          priv_key,
          wallet_pass_tmp,
        ).toString();

        wallet.privateKey = encrypted_key;
      }
      else{
        wallet.address = address;
        wallet.privateKey = "";
        wallet.publicKey = "";
      }

      wallet.ms = multisig;
      wallet.offline = offline;

      // Save the encrypted wallet in the local storage
      localStorage.setItem(wallet_name, JSON.stringify(wallet));
      localStorage.setItem('import_success', 'true');
      window.location.reload();
    },

    storeInWalletList(wallet_name) {
      // Store the wallet name in the wallet name list if it does not already exist
      if (localStorage.getItem('wallet_list')){
        const list = localStorage.getItem('wallet_list');
        localStorage.setItem(
          'wallet_list',
          (list && wallet_name + ',' + list) || wallet_name,
        );
      }
      else{
        localStorage.setItem(
          'wallet_list',
          wallet_name
        );
      }
    },

    async getTotalBalance(){
      let total = 0

      for (var w in this.wallets){
        const responseBalances = await services.wallet.fetchBalancesList(
          this.wallets[w].address,
        );
        if(responseBalances.data.result.length){
          total += parseInt(responseBalances.data.result.find(balance => balance.denom === 'uxdki').amount);
        }

        const responseDelegations = await services.wallet.fetchDelegatorsDelegationsList(
          this.wallets[w].address,
        );
        if(responseDelegations.data.result[0]){
          for (var delegation in responseDelegations.data.result) {
            total += parseInt(responseDelegations.data.result[delegation].balance.amount)
          }
        }


        const responseUndelegations = await services.wallet.fetchDelegatorsUnbondingDelegationsList(
          this.wallets[w].address,
        );

        if(responseUndelegations.data.result[0]){
          for (var delegation in responseUndelegations.data.result) {
            for (var entry in responseUndelegations.data.result[delegation].entries){
                total += parseInt(responseUndelegations.data.result[delegation].entries[entry].balance)
            }
          }
        }
      }
      this.total_usd = tokenUtil.formatShort(total * this.token_price_raw);
      this.total = tokenUtil.formatShort(total)
      this.token_price = tokenUtil.formatPrice(this.token_price_raw);
    }
  },
};
</script>

<style scoped>
h4 {
  color: white;
  font-weight: 700;
}
</style>
