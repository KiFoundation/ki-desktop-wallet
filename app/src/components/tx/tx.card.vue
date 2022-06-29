<template>
  <b-row v-if="transaction" class="transaction-card align-items-center mx-0">
    <b-col>
      <b-row class="w-100 align-items-center">

        <b-col cols="2" class="flex-row d-flex align-items-center">
          <unicon name="location-arrow" :fill="colors.secondary" />
          <h6 class="ml-2 text-truncate"><a :href="explorer+  (network == 'Mainnet'? 'txs/' : 'transactions/') + transaction[0]" target="_blank" > {{ transaction[0] }}</a></h6>
        </b-col>
        <b-col cols="1" style="padding-left:0px">
          <b-badge :class="[ 'badge-'+transaction[1]]" :style="{ fontSize: '12px' }" >
            {{transaction[1]}}
          </b-badge>
        </b-col>
        <b-col cols="2" v-if="transaction[1]=='undelegate' || transaction[1]=='redelegate' || transaction[1]=='withdraw'">
          <a :href="explorer+ 'validators/' + transaction[6]" target="_blank" >
            <h6 class="ml-3 text-truncate" :title="transaction[6]">{{validators_dict[transaction[6]] ? validators_dict[transaction[6]].moniker : transaction[6] }}</h6>
          </a>
        </b-col>
        <b-col cols="2" v-else >
          <a :href="explorer+ 'account/' + transaction[6]" target="_blank" :title="wallets_dict[transaction[6]]? wallets_dict[transaction[6]] : transaction[6]">
            <h6 class="ml-3 text-truncate" :title="transaction[6]">{{wallets_dict[transaction[6]]? wallets_dict[transaction[6]] : transaction[6] }}</h6>
          </a>
        </b-col>
        <b-col cols="2" v-if="transaction[1]=='delegate' || transaction[1]=='undelegate' || transaction[1]=='redelegate'">
          <a :href="explorer+ 'validators/' + transaction[2]" target="_blank" >
            <h6 class="text-truncate" :title="transaction[2]">{{validators_dict[transaction[2]] ? validators_dict[transaction[2]].moniker : transaction[2] }}</h6>
          </a>
        </b-col>
        <b-col cols="2" v-else  class="text">
          <a :href="explorer+ 'account/' + transaction[2]" target="_blank" :title="wallets_dict[transaction[2]]? wallets_dict[transaction[2]] : transaction[2]">
            <h6 class="text-truncate" :title="transaction[2]">{{wallets_dict[transaction[2]]? wallets_dict[transaction[2]] : transaction[2] }}</h6>
          </a>
        </b-col>
        <b-col cols="2" class="p-0">
          <span v-if="transaction[3] != ''">
            {{ globalData.kichain.token }} {{transaction[3]}}
          </span>
          <span v-else>
            -
          </span>
        </b-col>
        <b-col cols="1" class="p-0"><span>{{ globalData.kichain.token }} {{transaction[4]}}</span></b-col>
        <b-col cols="2" class="pr-0" style="text-align: end;"><span style="font-size: 9pt;">{{formatDateTime(transaction[5])}}</span></b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol, BButton, BBadge, } from 'bootstrap-vue';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      prefix: this.globalData.kichain.network.network,
      explorer:this.globalData.explorer
    }
  },
  components: {
    BRow,
    BCol,
    BBadge,
    // BPopover
  },
  props: {
    transaction: {
      type: Array,
      default: null,
    },

  },
  computed: {
    ...mapState({
      currentWallet: state => state.wallets.current,
      wallets_dict: state => state.wallets.dict,
      validators_dict: state => state.validators.dict,
    }),
  },
  methods: {
    onSelecttransaction() {
      this.$emit('onSelecttransaction', this.transaction);
    },
    formatDateTime(timestamp) {
      const date = new Date(Date.parse(timestamp))
      const options = {year: '2-digit', month: 'short', day: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' }
      return  date.toLocaleTimeString(undefined, timeOptions) + " " + date.toLocaleDateString(undefined, options) 
    },
  },
};
</script>

<style scoped>
.transaction-card {
  /* cursor: pointer; */
  width: 100%;
  color: black;
  /* min-height: 50px; */
  min-height: 50px;
  border: 1px solid #efefef;
  border-radius: 10px;
  background-color: white;
  transition: box-shadow 240ms, transform 200ms;
}
.transaction-card:hover {
  box-shadow: 0px 3px 3px rgba(154, 160, 185, 0.04);
}
.link {
  color: var(--primary);
  font-weight: 600;
}
.link:hover {
  color: var(--primary);
  text-decoration: underline;
}
</style>
