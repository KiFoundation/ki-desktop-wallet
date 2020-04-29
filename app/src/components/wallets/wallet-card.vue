<template>
  <b-row
    v-if="wallet"
    class="wallet-card align-items-center mx-0"
    @click="selectWallet"
  >
    <b-col cols="3">
      <b-avatar
        class="d-flex justify-content-center align-items-center"
        size="4rem"
        :variant="avatarRandomVariant"
        :text="wallet.account[0].toUpperCase()"
      />
    </b-col>
    <b-col cols="9">
      <h5>{{ wallet.account }}</h5>
      <h6
        :style="{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }"
      >
        {{ wallet.address }}
      </h6>
    </b-col>
  </b-row>
</template>

<script>
import { BAvatar, BRow, BCol } from 'bootstrap-vue';

export default {
  components: {
    BAvatar,
  },
  props: {
    wallet: {
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
  data() {
    return {};
  },

  methods: {
    selectWallet() {
      this.$emit('onSelectWallet', this.wallet);
    },
  },
};
</script>

<style scoped>
.wallet-card {
  cursor: pointer;
  width: 100%;
  color: black;
  min-height: 100px;
  border: 1px solid #efefef;
  border-radius: 10px;
  background-color: white;
  transition: box-shadow 240ms, transform 200ms;
}
.wallet-card:hover {
  box-shadow: 0px 8px 8px rgba(154, 160, 185, 0.09);
  transform: scale(1.01);
}
</style>
