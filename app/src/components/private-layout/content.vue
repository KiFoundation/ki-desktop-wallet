<template>
  <div
    class="d-flex content rounded w-100 h-100 pt-4 pl-3 pb-5"
    :style="{
      backgroundColor: 'transparent',
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.content {
  overflow: hidden;
}
</style>
