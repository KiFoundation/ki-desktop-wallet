<template>
  <div class="d-flex w-100 h-100 flex-column px-3">
    <div
      class="d-flex justify-content-between align-items-end mt-1"
      :style="{ position: 'relative', height: '47px' }"
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
        <ValidatorCard
          v-for="(validator, idx) in validators
            .filter(v =>
              new RegExp(`^${text}`, 'gi').test(v.description.moniker),
            )
            .slice(perPage * currentPage - perPage, perPage * currentPage)"
          :key="`validator-${idx}`"
          :validator="validator"
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
        <p style="font-size:60px">
          🤔
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {
  BRow,
  BCol,
  BButton,
  BButtonGroup,
  BPagination,
  BFormInput,
} from 'bootstrap-vue';
import { FETCH_WALLET_VALIDATORS } from '@store/wallets';
import ValidatorCard from '@cmp/validator/validator.card';
import WithdrawModal from './modals/withdraw.modal';

export default {
  components: {
    ValidatorCard,
    BPagination,
    BFormInput,
    WithdrawModal,
  },
  data() {
    return {
      selectedValidator: null,
      text: '',
      currentPage: 1,
      perPage: 5,
    };
  },
  computed: {
    ...mapState({
      advanced: state => state.app.advanced,
      validators: state => state.wallets.current.validators,
      account: state => state.account,
    }),
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      fetchMyValidators: FETCH_WALLET_VALIDATORS,
    }),
    selectValidator(validator) {
      this.selectedValidator = validator;
    },
    async handleWithdrawSuccess() {
      await this.fetchMyValidators();
      this.$bvModal.hide('withdraw-modal');
    },
  },
};
</script>

<style scoped></style>
