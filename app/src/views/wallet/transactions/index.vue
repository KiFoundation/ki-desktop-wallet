<template>
  <!-- <section > -->
  <div class="d-flex w-100 h-100 flex-column px-3">


      <b-row   v-if="transactions && transactions.length" class="header align-items-center mx-0" style="min-height:40px">
          <b-col>
            <b-row class="w-100 align-items-center">
              <b-col cols="2"><span class="ml-4">Tx</span></b-col>
              <b-col cols="1">type</b-col>
              <b-col cols="2"><span class="ml-3">From</span></b-col>
              <b-col cols="2">To</b-col>
              <b-col cols="3">Amount</b-col>
              <b-col cols="2">Fees</b-col>
            </b-row>
          </b-col>
        </b-row>

        <div
            v-if="transactions && transactions.length"
            class="d-flex flex-column justify-content-between h-100"
            >
        <div>

        <TransactionCard v-for="(item, index) in transactions
                .slice(perPage * currentPage - perPage, perPage * currentPage)"
                 v-bind:key="index"
                 :transaction="item"
                 class="mb-2" />
        </div>

        <div
          class="mt-2 mb-2"
          style="align-self:center;"
          v-if="transactions && transactions.length && transactions.length > perPage"
        >
          <b-pagination
            v-model="currentPage"
            :total-rows="
              transactions.length
            "
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
              <img src="static/img/chain/thinking-face.png" width="150px"/>
            </p>
          {{ $t('webwallet_no_transactions') }}
        </div>
      </div>
    </div>

    <!-- </section> -->
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {  BPagination } from 'bootstrap-vue';
import TransactionCard from '@cmp/tx/tx.card';

export default {
  data() {
    return {
      isActive: true,
      explorer:this.globalData.explorer,
      currentPage:1,
      perPage:10,
      blockchain_lowercase: '',
      nodeUrl: '',
      network: '',
      token: '',
      blockchain: 'KiChain',
      prefix: '',
      account: '',
      gradient_style: 'background-image: linear-gradient(90deg,#1848E0,#05268E);',
      isLoading: true,
      colors: {'send':'red', 'receive':'green', 'delegate':'black' }
    }
  },

  components: {
    BPagination,
    TransactionCard
  },
  computed: {
    ...mapState({
      transactions: state => state.wallets.current.transactions,
      // wallets_dict: state => state.wallets.dict,
      // validators_dict: state => state.wallets.current.validators_dict,
    }),

  },
};
</script>

<style scoped></style>
