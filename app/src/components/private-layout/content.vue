<template>
  <div
    class="d-flex content rounded w-100 h-100"
    :style="{
      backgroundColor: 'white',
      boxShadow: '0 10px 10px rgba(154, 160, 185, 0.05)',
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
  overflow: auto;
}
</style>
