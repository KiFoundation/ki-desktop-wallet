<template>
  <div
    class="d-flex content rounded w-100 h-100"
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
