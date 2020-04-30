<template>
  <div class="d-flex w-100 flex-column ">
    <div
      id="top-list"
      class="d-flex justify-content-between align-items-end "
      :style="{ position: 'relative' }"
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
          }"
        />
      </div>
      <b-button-group size="xl">
        <b-button
          v-for="(btn, idx) in buttons"
          :key="idx"
          :pressed="filter === btn.filter"
          variant="outline-primary"
          @click="btn.onPress()"
        >
          {{ btn.caption }}
        </b-button>
      </b-button-group>
    </div>
    <div v-if="validators && validators.length" class="mt-5">
      <ValidatorCard
        v-for="(validator, idx) in validators
          .filter(v => new RegExp(`^${text}`, 'gi').test(v.description.moniker))
          .slice(perPage * currentPage - perPage, perPage * currentPage)"
        :key="`validator-${idx}`"
        :validator="validator"
        class="mb-3"
      >
        <div>
          <a
            v-b-modal="'delegate-modal'"
            class="link"
            @click="selectedValidator = validator"
          >
            Delegate
          </a>
          <a
            v-b-modal="'undelegate-modal'"
            class="link ml-3"
            @click="selectedValidator = validator"
          >
            Undelegate
          </a>
          <a
            v-b-modal="'redelegate-modal'"
            class="link ml-3"
            @click="selectedValidator = validator"
          >
            Redelegate
          </a>
        </div>
      </ValidatorCard>
      <div class="mt-5">
        <b-pagination
          v-model="currentPage"
          :total-rows="
            validators.filter(v =>
              new RegExp(`^${text}`, 'gi').test(v.description.moniker),
            ).length
          "
          :per-page="perPage"
          aria-controls="my-table"
          @input="handleOnPageChange"
        />
      </div>
    </div>
    <div
      v-else
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
      <DelegateModal
        :validator="selectedValidator"
        @onDelegateSuccess="handleDelegateSuccess"
      />
      <UndelegateModal
        :validator="selectedValidator"
        @onUndelegateSuccess="handleUndelegateSuccess"
      />
      <RedelegateModal
        :validator="selectedValidator"
        @onRedelegateSuccess="handleRedelegateSuccess"
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
import { FETCH_VALIDATORS_LIST } from '@store/validators';
import ValidatorCard from '@cmp/validator/validator.card';
import DelegateModal from './modals/delegate.modal';
import UndelegateModal from './modals/undelegate.modal';
import RedelegateModal from './modals/redelegate.modal';

export default {
  components: {
    BButtonGroup,
    BButton,
    ValidatorCard,
    BPagination,
    BFormInput,
    DelegateModal,
    UndelegateModal,
    RedelegateModal,
  },
  data() {
    return {
      selectedValidator: null,
      text: '',
      currentPage: 1,
      perPage: 10,
      buttons: [
        {
          caption: 'My',
          onPress: this.handleClickOnMyFilter,
          filter: 'my',
        },
        {
          caption: 'All',
          onPress: this.handleClickOnOtherFilter,
          filter: 'all',
        },
      ],
      filter: 'all',
    };
  },
  computed: {
    ...mapState({
      advanced: state => state.app.advanced,
      myValidators: state => state.wallets.current.validators,
      allValidators: state => state.validators.list,
      account: state => state.account,
    }),
    validators() {
      return (this.filter === 'my' && this.myValidators) || this.allValidators;
    },
  },
  created() {
    this.filter = 'all';
  },
  mounted() {},
  methods: {
    ...mapActions({
      fetchMyValidators: FETCH_WALLET_VALIDATORS,
      fetchOtherValidators: FETCH_VALIDATORS_LIST,
    }),
    handleOnPageChange(page) {
      document.querySelector('#top-list').scrollIntoView({
        behavior: 'smooth',
      });
    },
    selectValidator(validator) {
      this.selectedValidator = validator;
    },
    async handleDelegateSuccess() {
      if (this.filter === 'my') {
        await this.fetchMyValidators();
        this.$bvModal.hide('delegate-modal');
      } else {
        await this.fetchOtherValidators();
        this.$bvModal.hide('delegate-modal');
      }
    },
    async handleUndelegateSuccess() {
      if (this.filter === 'my') {
        await this.fetchMyValidators();
        this.$bvModal.hide('undelegate-modal');
      } else {
        await this.fetchOtherValidators();
        this.$bvModal.hide('undelegate-modal');
      }
    },
    async handleRedelegateSuccess() {
      if (this.filter === 'my') {
        await this.fetchMyValidators();
        this.$bvModal.hide('redelegate-modal');
      } else {
        await this.fetchOtherValidators();
        this.$bvModal.hide('redelegate-modal');
      }
    },
    handleClickOnMyFilter() {
      (this.filter = 'my'), this.fetchMyValidators();
    },
    handleClickOnOtherFilter() {
      (this.filter = 'all'), this.fetchOtherValidators();
    },
  },
};
</script>

<style scoped></style>
