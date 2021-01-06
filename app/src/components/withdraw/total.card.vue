<template>
  <b-row class="total-card align-items-center mx-0">
    <b-col>
      <b-row class="w-100 align-items-center">
        <b-col cols="4" class="text-right">
          <h6 class="ml-4">Total</h6>
        </b-col>
        <b-col cols="4">
          <span
            :style="{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }"
          >
          {{reward}} {{ globalData.kichain.token }}

          </span>
        </b-col>
        <b-col cols="4" class="d-flex justify-content-end">
          <slot />
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol, BButton } from 'bootstrap-vue';
import * as numeral from 'numeral';
import { mapState } from 'vuex';
import { tokenUtil } from '@static/js/token';
import util from '@static/js/util';

export default {
  components: {
    BRow,
    BCol,
  },
  props: {
    reward: {
      type: String,
      default: null,
    },
  },
  computed: {
    ...mapState({
      currentWallet: state => state.wallets.current,
    }),
  },
  methods: {
    formatAmount(amount) {
      return tokenUtil.format(amount);
    },
  },
};
</script>

<style scoped>
.total-card {
  width: 100%;
  color: black;
  min-height: 50px;
  border: 1px solid #efefef;
  border-radius: 10px;
  background-color: white;
  transition: box-shadow 240ms, transform 200ms;
}
.total-card:hover {
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
