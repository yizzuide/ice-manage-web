<template>
  <div>Login: {{ a }}</div>
  <button @click="a++">a++</button>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";

const a = $ref(0);
</script>

<style scoped></style>
