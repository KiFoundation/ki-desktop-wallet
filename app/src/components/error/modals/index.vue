<template>
<b-modal :id="modalId" hide-footer hide-header no-close-on-esc >
  <b-row align-v="center" >
    <b-col >
      <div class="basic-form modal-body d-flex w-100">
        {{$t("error_wallet_invalid")}}
      </div>

      <div class="basic-form modal-body d-flex w-100">
        {{$t("warning_wallet_invalid_delete")}}
      </div>
    </b-col>
  </b-row>
</b-modal>
</template>

<script>
import {
  KeyPair,
  signTx,
  verifyTx,
  createWalletFromMnemonic,
  createBroadcastTx,
} from '@tendermint/sig';
import {
  BContainer,
  BModal,
  BTooltip,
} from 'bootstrap-vue';
import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex';

import {
  GET_CURRENT_WALLET_BALANCES_AMOUNT,
  GET_CURRENT_WALLET_BALANCES_DENOM,
  HYDRATE_CURRENT_WALLET,
} from '@store/wallets';

export default {
  components: {
  },
  props: {
    modalId: {
      type: String,
      default: 'error-modal',
    },
  },
};
</script>

<style scoped></style>
