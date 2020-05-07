<template>
  <section >

        <!-- <table class="table">
          <thead class="thead-null">
            <tr>
              <th scope="col">Tx</th>
              <th scope="col">type</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Amount</th>
              <th scope="col">Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in transactions.slice(perPage * currentPage - perPage, perPage * currentPage)" v-bind:key="index">
              <td class="text"><span><a :href="explorer+ '/transactions/' + item[0]" target="_blank">{{item[0]}}</a></span></td>
              <td class="text"><span>{{item[1]}}</span></td>
              <td class="text"><span><a :href="explorer+ '/account/' + item[6]" target="_blank">{{wallets_dict[item[6]]? wallets_dict[item[6]] : item[6] }}</a></span></td>
              <td v-if="item[1]=='delegate'" class="text"><span><a :href="explorer+ '/validator/' + item[2]" target="_blank">{{validators_dict[item[2]]? validators_dict[item[2]] : item[2] }}</a></span></td>
              <td  v-else  class="text"><span><a :href="explorer+ '/account/' + item[2]" target="_blank">{{wallets_dict[item[2]]? wallets_dict[item[2]] : item[2] }}</a></span></td>
              <td class="text"><span :style="{color:colors[item[1]]}">{{item[3]}}</span></td>
              <td class="text"><span>{{item[4]}}</span></td>
            </tr>

          </tbody>

        </table> -->

        <b-row class="header align-items-center mx-0">
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
        <TransactionCard v-for="(item, index) in transactions
                .slice(perPage * currentPage - perPage, perPage * currentPage)"
                 v-bind:key="index"
                 :transaction="item"
                 class="mb-3" />

        <div class="mt-5">
          <b-pagination
            v-model="currentPage"
            :total-rows="
              transactions.length
            "
            :per-page="perPage"
            aria-controls="my-table"
          />
        </div>
        <!-- <div class="table-footer">
          <span><a :href="explorer+ 'account/' + this.account" target="_blank">See all transactions</a></span>
        </div> -->

    </section>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {  BPagination } from 'bootstrap-vue';
import TransactionCard from '@cmp/tx/tx.card';

export default {
  data() {
    return {
      isActive: true,
      explorer:'https://blockchain.ki',
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
