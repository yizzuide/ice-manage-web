<template>
  <div>Login: {{ userStore.name }}</div>
  <button @click="changeName">修改</button>
</template>

<script setup lang="ts">
import useUserStore from "./store/userStore";

const userStore = useUserStore();

function changeName() {
  userStore.name = "yoy";
}
</script>

<style scoped></style>
