<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="bPath in getBreadcrumb()"
      :key="bPath.path"
      :to="{ path: bPath.path }"
    >
      {{ bPath.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const getBreadcrumb = () => {
  let matchedList = route.matched.filter((r) => r.meta && r.meta.title);
  if (matchedList.length > 0 && matchedList[0].meta.title == "/") {
    return [];
  }
  const breadcrumbPaths = <{ name: string; path: string }[]>[];
  matchedList.forEach((r) => {
    breadcrumbPaths.push({ name: r.meta.title as string, path: r.path });
  });
  return breadcrumbPaths;
};
</script>

<style scoped>
.el-breadcrumb {
  display: inline-block;
  margin-left: 15px;
}
</style>
