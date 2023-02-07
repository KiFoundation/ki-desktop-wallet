<template>
  <div
    class="h-100 d-flex flex-columns rounded justify-content-center list-container"
    :style="{
      width: '80px',
      backgroundColor: 'white',
      boxShadow: '0 10px 10px rgba(154, 160, 185, 0.05)',
      maxHeight: '100rem',
    }"
  >
    <ul>
      <router-link :to="{ name: 'home' }">
        <unicon name="wallet" fill="gray" width="36px" height="36px" />
      </router-link>
    </ul>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style scoped>
.list-container ul {
  padding: 30px 0;
  list-style-type: none;
  width: 100%;
  flex-direction: column;
  display: flex;
  gap: 10px;
  align-items: center;
}

.list-container a {
  cursor: pointer;
  display: flex;
  justify-content: center;
  width: 100%;
}

.list-container a.active {
  border-left: 4px solid #062ca3;
}
</style>
