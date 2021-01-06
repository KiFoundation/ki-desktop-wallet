<template>
  <div class="d-flex w-100 h-100 flex-column px-3">
    <div
      class="d-flex justify-content-between align-items-end mt-1"
      :style="{ position: 'relative', height: '41px' }"
    >
      <div class="h-100">
        <b-form-input
          v-if="validators && validators.length"
          v-model="text"
          size="lg"
          placeholder="Search by moniker..."
          :style="{
            position: 'absolute',
            top: '0px',
            height: '100%',
            width: 'auto',
            color: colors.secondary,
          }"
        />
      </div>
    </div>
    <div
      v-if="validators && validators.length"
      class="mt-3 d-flex flex-column justify-content-between h-100"
    >
      <div>
        <b-row class="header align-items-center mx-0" style="min-height:40px">
          <b-col>
            <b-row class="w-100 align-items-center">
              <b-col cols="4" class="flex-row d-flex align-items-center">
                <span style="margin-left:20px">Validator</span>
              </b-col>
              <b-col cols="4">
                Pending reward
              </b-col>
              <b-col cols="4" class="d-flex justify-content-end"/>
            </b-row>
          </b-col>
        </b-row>
        <ValidatorCard
          v-for="(validator, idx) in validators
            .filter(v =>
              new RegExp(`^${text}`, 'gi').test(v.description.moniker),
            )
            .slice(perPage * currentPage - perPage, perPage * currentPage)"
          :key="`validator-${idx}`"
          :validator="validator"
          :reward="rewards[validator.operator_address]"
          class="mb-2"
        >
          <a
            v-b-modal="'withdraw-modal'"
            class="link"
            @click="selectedValidator = validator"
          >
            Withdraw
          </a>
        </ValidatorCard>
        <TotalCard
          :key="`total`"
          :reward="mergedRewards"
          class="mb-2"
        >
          <a
            v-b-modal="'withdraw-all-modal'"
            class="link"
          >
            Withdraw all
          </a>
        </TotalCard>
      </div>
      <div
        class="mt-2 mb-2"
        style="align-self:center;"
        v-if="validators && validators.length && validators.length > perPage"
      >
        <b-pagination
          v-model="currentPage"
          :total-rows="
            validators.filter(v =>
              new RegExp(`^${text}`, 'gi').test(v.description.moniker),
            ).length
          "
          :per-page="perPage"
          aria-controls="my-table"
        />
      </div>
    </div>
    <div
      v-if="validators && !validators.length"
      class="d-flex align-items-center w-100 h-100 text-center justify-content-center"
    >
      <div>
        <p style="margin-bottom: 10px">
          <img src="static/img/chain/thinking-face.png" width="150px"/>
        </p>
        {{ $t('webwallet_no_delegations') }}
      </div>
    </div>
    <div v-if="selectedValidator">
      <WithdrawModal
        :validator="selectedValidator"
        @onWithdrawSuccess="handleWithdrawSuccess"
      />
    </div>
    <WithdrawAllModal
     :validators="validators"
     :rewards="rewards"
     @onWithdrawSuccess="handleWithdrawSuccess"
     />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {
  BRow,
  BCol,
  BPagination,
  BFormInput,
} from 'bootstrap-vue';
import { FETCH_WALLET_VALIDATORS, FETCH_WALLET_REWARDS } from '@store/wallets';
import ValidatorCard from '@cmp/validator/validator.card';
import TotalCard from '@cmp/withdraw/total.card';
import WithdrawModal from './modals/withdraw.modal';
import WithdrawAllModal from './modals/withdraw-all.modal';
import * as numeral from 'numeral';
import { tokenUtil } from '@static/js/token';

export default {
  components: {
    TotalCard,
    ValidatorCard,
    BPagination,
    BFormInput,
    WithdrawModal,
    WithdrawAllModal,
  },
  data() {
    return {
      selectedValidator: null,
      text: '',
      currentPage: 1,
      perPage: 8,
    };
  },
  computed: {
    ...mapState({
      myValidators: state => state.wallets.current.validators,
      rewards:  state => state.wallets.current.rewards,
      account: state => state.account,
    }),
    validators() {
      var val = this.myValidators
      val.sort((a, b) => {
            let da = a.tokens,
                db = b.tokens;
            return db - da;
        });
      return val
    },

    mergedRewards(){
      var pending = 0;

      for (var val in this.rewards){
        pending +=  numeral(this.rewards[val]).value() * Math.pow(10, 6)
      }
      return tokenUtil.format(pending)
    }

  },
  mounted() {
     this.fetchRewards();
  },
  methods: {
    ...mapActions({
      fetchMyValidators: FETCH_WALLET_VALIDATORS,
      fetchRewards: FETCH_WALLET_REWARDS,

    }),
    selectValidator(validator) {
      this.selectedValidator = validator;
    },
    async handleWithdrawSuccess() {
      await this.fetchMyValidators();
      await this.fetchRewards();
      this.$bvModal.hide('withdraw-modal');
      this.$bvModal.hide('withdraw-all-modal');
    },
  },
};
</script>

<style scoped></style>
