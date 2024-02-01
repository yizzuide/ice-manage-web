<template>
  <div class="container">
    <el-container>
      <el-aside :width="isMenuCollapse ? '64px' : '200px'">
        <MenuLogo :collapse="isMenuCollapse"></MenuLogo>
        <el-scrollbar>
          <el-menu
            :active-text-color="varColor.textHighBrightColor"
            :background-color="varColor.darknessColor"
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
      <el-container class="body" @click="() => $eventBus.emit('unselect')">
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
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import varColor from "@/styles/define.module.scss";
import useUserStore from "../login/store/userStore";
import { useHomeStore } from "./store/homeStore";
import MenuItem from "./views/MenuItem.vue";
import MenuLogo from "./views/MenuLogo.vue";
import HeaderContent from "./views/HeaderContent.vue";
import Breadcrumb from "./views/Breadcrumb.vue";
import Tags from "./views/Tags.vue";
import useAliveRouteNames from "@/hooks/useAliveRouteNames";
import useEventBus from "@/hooks/useEventBus";



const keepAliveList = useAliveRouteNames();
const userStore = useUserStore();
const homeStore = useHomeStore();

const isMenuCollapse = ref(false);
//const selectedMenuIndex = ref<string>(homeStore.selectedMenuIndex);
const { selectedMenuIndex } = storeToRefs(homeStore);

const eventBus = useEventBus();
onMounted(() => {
  eventBus.on("operationLog", (data) => {
    // 使用自定义Action类型
    //usedAction<LogAction>(logStore).addLogRecord(data).then((_)=>{});
  });
});

// 刷新时初始化为上次浏览的路由路径
const route = useRoute();
const router = useRouter();
if (route.path != selectedMenuIndex.value) {
  router.replace(selectedMenuIndex.value);
}

function menuSelect(index: string) {
  // 已通过Tags组件watch来修改
  //selectedMenuIndex.value = index;
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
    .el-aside {
      // 显示滚动类型
      //overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      // 宽度修改动画
      transition: width 0.25s ease-out;
      -webkit-transition: width 0.25s ease-out;
      -moz-transition: width 0.25s ease-out;
      -o-transition: width 0.25s ease-out;
    }

    .el-menu:not(.el-menu--collapse) {
      width: 100%;
    }

    .el-scrollbar {
      background-color: $darknessColor;
      overflow-y: scroll;
    }
    // 展开子菜单列表背景色
    :deep(.is-opened .el-menu-item) {
      background-color: $drawerBgColor;
    }
    // 展开子菜单列表鼠标hover背景色
    :deep(.is-opened .el-menu-item:hover) {
      background-color: $highBrightColor;
    }
  }

  .body {
    > .el-header {
      height: 50px;
      border-bottom: 1px solid $separatorLineColor;
    }

    nav {
      width: 100%;
      min-height: 32px;
      border-bottom: 1px solid $separatorLineColor;
    }

    .el-scrollbar {
      background-color: $panelBgColor;
    }

    .el-main {
      background-color: $panelBgColor;

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
