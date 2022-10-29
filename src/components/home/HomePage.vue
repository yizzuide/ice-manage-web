<template>
  <div class="container">
    <el-container>
      <el-aside width="auto">
        <MenuLogo :collapse="isMenuCollapse"></MenuLogo>
        <el-scrollbar>
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
        </el-scrollbar>
      </el-aside>
      <el-container class="body">
        <el-header>
          <HeaderContent @change="(isExpand) => (isMenuCollapse = !isExpand)">
            <Breadcrumb></Breadcrumb>
          </HeaderContent>
        </el-header>
        <nav>
          <Tags></Tags>
        </nav>
        <el-scrollbar>
          <el-main>
            <router-view v-slot="{ Component, route }">
              <template v-if="Component">
                <transition name="fade-transform" mode="out-in" appear>
                  <keep-alive :include="keepAliveList">
                    <component :is="Component" :key="route.path"></component>
                  </keep-alive>
                </transition>
              </template>
            </router-view>
          </el-main>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import useUserStore from "../login/store/userStore";
import { useHomeStore } from "./store/homeStore";
import MenuItem from "./views/MenuItem.vue";
import MenuLogo from "./views/MenuLogo.vue";
import HeaderContent from "./views/HeaderContent.vue";
import Breadcrumb from "./views/Breadcrumb.vue";
import Tags from "./views/Tags.vue";
import useAliveRouteNames from "@/hooks/useAliveRouteNames";

const keepAliveList = useAliveRouteNames();
const userStore = useUserStore();
const homeStore = useHomeStore();

const isMenuCollapse = ref(false);
//const selectedMenuIndex = ref<string>(homeStore.selectedMenuIndex);
const { selectedMenuIndex } = storeToRefs(homeStore);

// 刷新时初始化为上次浏览的路由路径
const route = useRoute();
const router = useRouter();
if (route.path != selectedMenuIndex.value) {
  router.replace(selectedMenuIndex.value);
}

function menuSelect(index: string) {
  selectedMenuIndex.value = index;
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
    // el-menu[width="auto"] + 下面设置未收起的配置实现菜单向左收缩的效果
    .el-menu:not(.el-menu--collapse) {
      width: 200px;
    }
    .el-scrollbar {
      background-color: #a35524;
      overflow-y: scroll;
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
      height: 50px;
      border-bottom: 1px solid #e5e5e5;
    }

    nav {
      min-height: 32px;
      border-bottom: 1px solid #e5e5e5;
    }

    .el-scrollbar {
      background-color: #eee;
    }

    .el-main {
      background-color: #eee;

      .fade-transform-enter-from,
      .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(-15px);
      }

      .fade-transform-enter-active,
      .fade-transform-leave-active {
        transition: all 0.5s ease;
      }
    }
  }
}
</style>
