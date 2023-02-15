<script lang="ts">
import { BTooltip } from 'bootstrap-vue';
export default {
  inject: ['colors'],
  components: {
    BTooltip,
  },
  props: {
    loading: Boolean,
    title: String,
    amount: Number,
    amountSize: String,
    amountCurrency: String,
    dollarAmount: Number,
    tokenPrice: Number,
    tokenPriceCurrency: String,
  },
};
</script>

<template>
  <div class="d-flex flex-column">
    <p
      v-if="title !== null"
      :style="{
        color: 'var(--secondary)',
        fontSize: '0.85rem',
        fontWeight: 600,
      }"
    >
      {{ title }}
    </p>
    <div v-if="!loading">
      <h6 :style="{ fontWeight: 'bolder', fontSize: amountSize || '1.2rem' }">
        {{ amount }} {{ amountCurrency }}
      </h6>
      <p
        class="d-flex align-items-center"
        :style="{
          color: 'var(--secondary)',
          fontSize: '0.85rem',
          fontWeight: 600,
          gap: '5px',
        }"
      >
        ≈ ${{ dollarAmount }} {{ tokenPrice !== undefined ? `($${tokenPrice}/${tokenPriceCurrency})` : null }}
      </p>
    </div>
    <free-style-shimmer
      :is-loading="loading === true"
      height="15px"
      width="120px"
      border-radius="5px"
      color="var(--primary)"
    />
    <free-style-shimmer
      :is-loading="loading === true"
      height="12px"
      width="100px"
      border-radius="5px"
      color="var(--secondary)"
      :style="{ marginTop: '8px' }"
    />
  </div>
</template>

<style scoped></style>
