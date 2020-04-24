<template>
  <div
    class="d-flex w-100 justify-content-center align-items-center rounded"
    :style="{ backgroundColor: 'black', width: '80px', height: '80px' }"
  >
    <BImg :src="logo" fluid :style="{ height: '50%' }" />
  </div>
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
