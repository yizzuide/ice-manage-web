<template>
  <div class="login">
    <LoginPanel></LoginPanel>
  </div>
</template>

<script setup lang="ts">
import LoginPanel from "./views/LoginPanel.vue";
</script>

<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url("@/assets/login_bg.svg") no-repeat 50% 50% / 100% 100% fixed;
}
</style>
