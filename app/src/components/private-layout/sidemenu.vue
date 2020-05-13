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
      <router-link tag="li" :to="{ name: 'home' }" exact active-class="active">
        <unicon name="wallet" fill="gray" width="36px" height="36px" />
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.list-container ul {
  padding: 30px 0;
  list-style-type: none;
  width: 100%;
}

.list-container li {
  cursor: pointer;
  padding-left: 30%;
}

.list-container li.active {
  border-left: 4px solid #062ca3;
  padding-left: 25%;
}
</style>
