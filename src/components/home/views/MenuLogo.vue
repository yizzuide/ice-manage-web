<template>
  <div class="logo">
    <img src="@/assets/menu_logo.png" />
    <span
      class="title"
      :style="[{ display: collapse ? 'none' : 'inline-block' }]"
      >Ice任务管理平台</span
    >
  </div>
  <div class="divider"></div>
</template>

<script setup lang="ts">
defineProps<{ collapse: boolean }>();
</script>

<style scoped lang="scss">
.logo {
  background-color: saddlebrown;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  padding-left: 15px;
  color: #fff;

  > img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
  span {
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    font-family: "Courier New", Courier, monospace, Arial, Helvetica, sans-serif;
    vertical-align: middle;
    animation: logoTextAnimation 1s ease-out;
  }
}

@keyframes logoTextAnimation {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
