<template>
  <router-link
    class="d-flex justify-content-center align-items-center rounded"
    :style="{ backgroundColor: 'black', width: '80px', height: '80px' }"
    :to="{
      name: 'home',
    }"
  >
    <BImg :src="logo" fluid :style="{ height: '50%' }" />
  </router-link>
</template>

<script>
import { BImg } from 'bootstrap-vue';

export default {
  components: {
    BImg,
  },
  data() {
    return {
      logo: 'static/img/chain/kichain1_white@2x.png',
    };
  },
};
</script>

<style scoped></style>
