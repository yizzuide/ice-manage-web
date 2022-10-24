<template>
  <template v-for="menu in menuList" :key="menu.id">
    <el-menu-item
      :index="menu.routePath"
      v-if="!menu.children || menu.children.length == 0"
    >
      <template #title>
        <el-icon>
          <named-icon :icon="menu.icon"></named-icon>
        </el-icon>
        <span>{{ menu.name }}</span>
      </template>
    </el-menu-item>
    <el-sub-menu :index="menu.routePath" v-else>
      <template #title>
        <el-icon>
          <named-icon :icon="menu.icon"></named-icon>
        </el-icon>
        <span>{{ menu.name }}</span>
      </template>
      <!-- 递归调用子菜单列表 -->
      <MenuItem :menuList="menu.children"></MenuItem>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { Menu } from "@/components/login/store/userStore";

defineProps<{ menuList: Menu[] }>();
</script>

<style scoped></style>
