<template>
  <router-link
    class="d-flex justify-content-center align-items-center"
    :style="{ backgroundColor: 'transparent', width: '80px', height: '80px' }"
    :to="{
      name: 'home',
    }"
  >
    <img src="/img/chain/kichain_icon@2x.png" :style="{ height: '50%', objectFit: 'contain' }" alt="" />
  </router-link>
</template>

<script lang="ts">
import { BImg } from 'bootstrap-vue';

export default {
  components: {
    BImg,
  },
  data() {
    return {
      logo: '/img/chain/kichain_icon@2x.png',
    };
  },
};
</script>

<style scoped></style>
