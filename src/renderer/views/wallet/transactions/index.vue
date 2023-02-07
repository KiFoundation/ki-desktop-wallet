<template>
  <!-- <section > -->
  <div class="d-flex w-100 h-100 flex-column px-3">
    <b-row
      v-if="transactions && transactions.length"
      class="header align-items-center mx-0"
      style="min-height: 40px"
    >
      <b-col>
        <b-row class="w-100 align-items-center">
          <b-col cols="2"><span class="ml-4">Tx</span></b-col>
          <b-col cols="1" style="padding-left: 0px">type</b-col>
          <b-col cols="2"><span class="ml-3">From</span></b-col>
          <b-col cols="2">To</b-col>
          <b-col cols="2" class="p-0">Amount</b-col>
          <b-col cols="1" class="p-0">Fees</b-col>
          <b-col cols="1" />
          <b-col cols="" class="pr-0" style="text-align: end">
            <a
              role="button"
              class="d-flex flex-column"
              @click="downloadTxs()"
              title="Export transaction history"
            >
              <unicon name="file-download-alt" fill="#2d1d67" />
            </a>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <div v-if="transactions && transactions.length" class="d-flex flex-column justify-content-between h-100">
      <div>
        <TransactionCard
          v-for="(item, index) in transactions.slice(perPage * currentPage - perPage, perPage * currentPage)"
          v-bind:key="index"
          :transaction="item"
          class="mb-2"
        />
      </div>

      <div
        class="mt-2 mb-2"
        style="align-self: center"
        v-if="transactions && transactions.length && transactions.length > perPage"
      >
        <b-pagination
          v-model="currentPage"
          :total-rows="transactions.length"
          :per-page="perPage"
          aria-controls="my-table"
        />
      </div>
    </div>

    <div
      v-if="transactions && !transactions.length"
      class="d-flex align-items-center w-100 h-100 text-center justify-content-center"
    >
      <div>
        <p style="margin-bottom: 10px">
          <img src="/img/chain/thinking-face.png" width="150px" />
        </p>
        {{ $t('webwallet_no_transactions') }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BPagination, BRow, BCol } from 'bootstrap-vue';
import TransactionCard from '@cmp/tx/tx.card.vue';

export default {
  inject: ['globalData'],
  data() {
    return {
      isActive: true,
      explorer: this.globalData.explorer,
      currentPage: 1,
      perPage: 10,
      blockchain_lowercase: '',
      nodeUrl: '',
      network: '',
      token: '',
      blockchain: 'KiChain',
      prefix: '',
      account: '',
      gradient_style: 'background-image: linear-gradient(90deg,#1848E0,#05268E);',
      isLoading: true,
      colors: { send: 'red', receive: 'green', delegate: 'black' },
    };
  },

  components: {
    BRow,
    BCol,
    BPagination,
    TransactionCard,
    // BPopover
  },
  computed: {
    ...mapState({
      transactions: (state) => state.wallets.current.transactions,
    }),
    currentWallet() {
      return this.$store.state.wallets.current;
    },
  },
  methods: {
    downloadTxs() {
      let filename = 'transaction_export_' + this.currentWallet.address + '.csv';
      let csv_data = 'TIMESTAMP,TX_HASH,TYPE,FROM,TO,AMOUNT,FEES\n';
      for (var tx of this.transactions) {
        csv_data += [tx[5], tx[0], tx[1], tx[6], tx[2], tx[3].replaceAll(',', ''), tx[4]].join(',') + '\n';
      }

      let href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv_data);

      var element = document.createElement('a');
      element.setAttribute('href', href);
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
  },
};
</script>

<style scoped>
a:not([href]) {
  color: var(--blueColor);
  font-size: 8px;
}
</style>
