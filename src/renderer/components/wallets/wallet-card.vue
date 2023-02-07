<template>
  <div>
    <b-row v-if="wallet" class="wallet-card align-items-center mx-0" @click.self="selectWallet">
      <b-col cols="3" class="pr-0" @click="selectWallet">
        <b-avatar
          class="d-flex justify-content-center align-items-center"
          size="56px"
          :text="wallet.account[0].toUpperCase()"
          :style="{ backgroundImage: avatarGradient, color: 'white' }"
        />
      </b-col>
      <b-col cols="7" class="pr-0" @click="selectWallet">
        <h5
          :style="{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }"
        >
          {{ wallet.account }}
        </h5>
        <h6
          :style="{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: colors.secondary,
          }"
        >
          {{ formatAddress(wallet.address) }}
        </h6>
      </b-col>

      <b-col cols="2">
        <a role="button" data-toggle="modal" :data-target="'#edit-form-' + wallet.account">
          <img src="/img/icons/kebab-c.png" :width="8" class="more" />
        </a>
      </b-col>
    </b-row>
    <EditWalletForm
      :modalId="'edit-form-' + wallet.account"
      :wallet="wallet"
      @onUpdateSuccess="handleUpdateSucces"
    />
  </div>
</template>

<script lang="ts">
import { BAvatar, BRow, BCol } from 'bootstrap-vue';
import EditWalletForm from '@cmp/wallets/modals/edit-wallet.vue';
import util from '@helpers/util';

export default {
  inject: ['colors'],
  components: {
    BRow,
    BCol,
    EditWalletForm,
    BAvatar,
  },
  props: {
    wallet: {
      type: Object,
      default: null,
    },
  },
  computed: {
    avatarRandomVariant() {
      const variants = ['secondary', 'primary', 'dark', 'light', 'success', 'danger', 'warning', 'info'];
      return variants[Math.floor(Math.random() * variants.length)];
    },
    avatarGradient() {
      return util.generateWalletGradient(this.wallet.address);
    },
  },
  data() {
    return {
      optionsArray: [
        {
          name: 'Add Star',
          slug: 'add-star',
          class: 'my-custom-class',
        },
        {
          name: 'Remove Star',
          slug: 'remove-star',
        },
      ],
    };
  },
  methods: {
    selectWallet() {
      this.$emit('onSelectWallet', this.wallet);
    },
    handleUpdateSucces() {
      this.$bvModal.hide('#edit-form-' + this.wallet.account);
      window.location.reload();
    },
    formatAddress(address) {
      return util.shortenAddress(address);
    },
    deleteWallet() {
      if (confirm('Do you really want to delete ' + this.wallet.account + ' ?')) {
        localStorage.removeItem(this.wallet.account);
        var wallet_list_tmp = localStorage.getItem('wallet_list')
          ? localStorage.getItem('wallet_list').split(',')
          : '';
        var index = wallet_list_tmp.indexOf(this.wallet.account);

        if (index > -1) {
          wallet_list_tmp.splice(index, 1);
        }
        if (wallet_list_tmp.length == 0) {
          localStorage.setItem('identity_kichain', '');
          localStorage.setItem('current_wallet', '');
        }
        localStorage.setItem('wallet_list', wallet_list_tmp.join(','));
        window.location.reload();
      }
    },
  },
};
</script>

<style scoped>
.wallet-card {
  cursor: pointer;
  width: 100%;
  color: black;
  min-height: 100px;
  border: 1px solid #efefef;
  border-radius: 10px;
  background-color: white;
  transition: box-shadow 240ms, transform 200ms;
}
.wallet-card:hover {
  box-shadow: 0px 8px 8px rgba(154, 160, 185, 0.09);
  transform: scale(1.01);
}

.more {
  opacity: 0.2;
}

.more:hover {
  opacity: 0.5;
}
</style>
