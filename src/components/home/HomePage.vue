<template>
  <div class="container">
    <el-container>
      <el-aside width="auto">
        <MenuLogo></MenuLogo>
        <el-menu
          active-text-color="#ffd04b"
          background-color="#A35524"
          text-color="#fff"
          class="el-menu"
          :default-active="selectedMenuIndex"
          :collapse="isMenuCollapse"
          :unique-opened="true"
          :router="true"
          @select="menuSelect"
        >
          <MenuItem :menu-list="userStore.menuList"></MenuItem>
        </el-menu>
      </el-aside>
      <el-container class="body">
        <el-header>
          <HeaderContent></HeaderContent>
        </el-header>
        <el-main>
          <nav>导航</nav>
          <section class="routerContent">
            <router-view></router-view>
          </section>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useUserStore from "../login/store/userStore";
import MenuItem from "./views/MenuItem.vue";
import MenuLogo from "./views/MenuLogo.vue";
import HeaderContent from "./views/HeaderContent.vue";

const userStore = useUserStore();
const selectedMenuIndex = ref("/index/dashboard");
const isMenuCollapse = ref(false);

function menuSelect(index: string) {
  console.log("index: ", index);
}
</script>

<style scoped lang="scss">
.container {
  height: 100%;

  .el-container {
    height: 100%;

    .el-aside,
    .el-menu {
      height: 100%;
      // 去掉白边框
      border-right: none;
      user-select: none;
    }
    // 内容不滚动
    .el-aside {
      overflow-y: hidden;
    }
    // 菜单可滚动
    .el-menu {
      overflow-y: scroll;
    }
    // el-menu[width="auto"] + 下面设置未收起的配置实现菜单向左收缩的效果
    .el-menu:not(.el-menu--collapse) {
      width: 200px;
    }
    // 展开子菜单列表背景色
    :deep(.is-opened .el-menu-item) {
      background-color: #ab7a24;
    }
    // 展开子菜单列表鼠标hover背景色
    :deep(.is-opened .el-menu-item:hover) {
      background-color: #ca9740;
    }
  }

  .body {
    > .el-header {
      height: 55px;
      border-bottom: 1px solid #e5e5e5;
    }

    .el-main {
      nav {
        height: 32px;
      }

      .routerContent {
        height: 100%;
      }
    }
  }
}
</style>
