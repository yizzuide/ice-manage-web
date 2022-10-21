<template>
  <div>
    <h1>主页</h1>
    <p>user: {{ userStore.userInfo.nickname }}</p>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/components/login/store/userStore";
const userStore = useUserStore();
</script>

<style scoped></style>
