<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="bPath in getBreadcrumb()"
      :key="bPath.path"
      :to="{ path: bPath.path }"
    >
      {{ bPath.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { RouteInfo } from "../types/route-info";

const route = useRoute();
const getBreadcrumb = () => {
  let matchedList = route.matched.filter((r) => r.meta && r.meta.title);
  // 第一个路由为“/”的不显示，这个是顶级菜单
  if (matchedList.length > 0 && matchedList[0].meta.title == "/") {
    return [];
  }
  const breadcrumbPaths = <RouteInfo[]>[];
  matchedList.forEach((r) => {
    breadcrumbPaths.push({ title: r.meta.title as string, path: r.path });
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
