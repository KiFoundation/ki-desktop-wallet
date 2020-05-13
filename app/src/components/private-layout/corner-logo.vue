<template>
  <router-link
    class="d-flex justify-content-center align-items-center"
    :style="{ backgroundColor: 'transparent', width: '80px', height: '80px' }"
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
      logo: 'static/img/chain/kichain_icon@2x.png',
    };
  },
};
</script>

<style scoped></style>
