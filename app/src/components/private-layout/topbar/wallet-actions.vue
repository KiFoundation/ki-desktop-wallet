<template>
  <div class="d-flex w-100 h-100 justify-content-between align-items-center">
    <div>
      <h4>{{ currentWallet.account }}</h4>
      <h6>{{ currentWallet.address }}</h6>
    </div>
    <div class="d-flex flex-row">
      <div class="pr-4">
        <a
          role="button"
          data-toggle="modal"
          data-target="#add-form-topbar"
          class="d-flex flex-column align-items-center justify-content-center"
          @click="handleRefresh"
        >
          <unicon name="sync" fill="royalblue" />
          <span class="mt-2" :style="{ fontWeight: '600', color: 'white' }"
            >Refresh</span
          >
        </a>
      </div>
      <div class="border-left pl-4">
        <a
          role="button"
          data-toggle="modal"
          data-target="#transfer-modal"
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <unicon name="exchange" fill="royalblue" />
          <span class="mt-2" :style="{ fontWeight: '600', color: 'white' }"
            >Make a Transfer</span
          >
        </a>
      </div>
    </div>
    <TransferModal modalId="transfer-modal" />
  </div>
</template>

<script>
import { store, getters } from '@store';
import TransferModal from '@cmp/transfer/modals/index';

export default {
  components: {
    TransferModal,
  },
  computed: {
    currentWallet() {
      return getters.currentWallet();
    },
  },
  methods: {
    handleRefresh() {
      alert('To Implement');
    },
  },
};
</script>

<style scoped>
* {
  color: white;
}
</style>
