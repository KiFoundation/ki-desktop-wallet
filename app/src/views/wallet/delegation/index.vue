<template>
  <div class="d-flex w-100 h-100 flex-column px-3">
    <div
      class="d-flex justify-content-between align-items-end mt-1"
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
            color: colors.textColor,
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
                Share / total
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
          class="mb-2"
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
              :class="{'link':my_v_list.includes(validator.operator_address) ,'ml-3':true}"
              @click="selectedValidator = validator; "
              :disabled="!my_v_list.includes(validator.operator_address)"
            >
              Undelegate
            </a>
            <a
              v-b-modal="'redelegate-modal'"
              :class="{'link':my_v_list.includes(validator.operator_address) ,
                        'ml-3':true}"
              @click="selectedValidator = validator"
              :disabled="!my_v_list.includes(validator.operator_address)"
            >
              Redelegate
            </a>
          </div>
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
          @input="handleOnPageChange"
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
      my_v_list: [],
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
      var val = (this.filter === 'my' && this.myValidators) || this.allValidators;
      val.sort((a, b) => {
            let da = a.tokens,
                db = b.tokens;
            return db - da;
        });
      return val
    },
  },
  created() {
    this.filter = 'all';
    this.myValidators.forEach(key => this.my_v_list.push(key.operator_address))
  },
  mounted() {},
  methods: {
    ...mapActions({
      fetchMyValidators: FETCH_WALLET_VALIDATORS,
      fetchOtherValidators: FETCH_VALIDATORS_LIST,
    }),
    handleOnPageChange(page) {
      document.querySelector('#content-renderer').scrollTop = 0;
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
