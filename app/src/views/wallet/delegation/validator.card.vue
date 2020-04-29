<template>
  <b-row v-if="validator" class="validator-card align-items-center mx-0">
    <b-col cols="1">
      <b-avatar
        class="d-flex justify-content-center align-items-center"
        size="4rem"
        :variant="avatarRandomVariant"
        :text="validator.description.moniker[0].toUpperCase()"
      />
    </b-col>
    <b-col cols="5">
      <h5>{{ validator.description.moniker }}</h5>
      <h6
        :style="{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }"
      >
        {{ formatAmount(validator.delegator_shares) }}
      </h6>
    </b-col>
    <b-col cols="6" class="d-flex justify-content-end">
      <div>
        <b-button
          v-b-modal="'delegate-modal'"
          size="sm"
          variant="outline-primary"
          @click="onSelectValidator"
        >
          Delegate
        </b-button>
        <b-button
          v-b-modal="'undelegate-modal'"
          size="sm"
          variant="outline-primary"
          @click="onSelectValidator"
        >
          Undelegate
        </b-button>
        <b-button
          v-b-modal="'redelegate-modal'"
          size="sm"
          variant="outline-primary"
          @click="onSelectValidator"
        >
          Redelegate
        </b-button>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol, BAvatar, BButton } from 'bootstrap-vue';
import * as numeral from 'numeral';

export default {
  components: {
    BRow,
    BCol,
    BAvatar,
  },
  props: {
    validator: {
      type: Object,
      default: null,
    },
  },
  computed: {
    avatarRandomVariant() {
      const variants = [
        'secondary',
        'primary',
        'dark',
        'light',
        'success',
        'danger',
        'warning',
        'info',
      ];
      return variants[Math.floor(Math.random() * variants.length)];
    },
  },
  methods: {
    onSelectValidator() {
      this.$emit('onSelectValidator', this.validator);
    },
    formatAmount(amount) {
      return numeral(amount / Math.pow(10, 6)).format('0,0.000000');
    },
  },
};
</script>

<style scoped>
.validator-card {
  /* cursor: pointer; */
  width: 100%;
  color: black;
  min-height: 100px;
  border: 1px solid #efefef;
  border-radius: 10px;
  background-color: white;
  transition: box-shadow 240ms, transform 200ms;
}
.validator-card:hover {
  box-shadow: 0px 3px 3px rgba(154, 160, 185, 0.04);
}
</style>
