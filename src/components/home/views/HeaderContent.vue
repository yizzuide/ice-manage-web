<template>
  <div class="header">
    <section class="header-left">
      <el-icon><Expand /></el-icon>
    </section>
    <section class="header-right">个人中心</section>
  </div>
</template>

<script setup lang="ts">
import { Expand } from "@element-plus/icons-vue";
</script>

<style scoped lang="scss">
.header {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
