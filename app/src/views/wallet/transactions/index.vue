<template>
  <section class="main-info">

        <table class="table">
          <thead class="thead-null">
            <tr>
              <th scope="col">Tx</th>
              <th scope="col">type</th>
              <th scope="col">To</th>
              <th scope="col">Amount</th>
              <th scope="col">Fees</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentWallet.transactions" v-bind:key="item">
              <td class="text"><span><a :href="explorer+ 'transactions/' + item[0]" target="_blank">{{item[0]}}</a></span></td>
              <td class="text"><span>{{item[1]}}</span></td>
              <td class="text"><span><a :href="explorer+ 'account/' + item[2]" target="_blank">{{item[2]}}</a></span></td>
              <td class="text"><span>{{item[3]}}</span></td>
              <td class="text"><span>{{item[4]}}</span></td>
            </tr>

          </tbody>

        </table>
        <div class="table-footer">
          <span><a :href="explorer+ 'account/' + this.account" target="_blank">See all transactions</a></span>
        </div>

    </section>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      explorer:'',
      blockchain_lowercase: '',
      nodeUrl: '',
      network: '',
      token: '',
      blockchain: 'KiChain',
      prefix: '',
      account: '',
      transactions: [],
      gradient_style: 'background-image: linear-gradient(90deg,#1848E0,#05268E);',
      isLoading: true
    }
  },

  computed: {
    currentWallet() {
      console.log(this.$store.state.wallets.current.transactions)
      return this.$store.state.wallets.current;
    },
  }
};
</script>

<style scoped></style>
