<template>
  <div class="container">
    <header>头部</header>
    <section class="body">
      <aside>
        <el-menu
          active-text-color="#ffd04b"
          background-color="#A35524"
          class="el-menu"
          :default-active="selectedMenuIndex"
          text-color="#fff"
          :unique-opened="true"
          :router="true"
          @select="menuSelect"
        >
          <template v-for="menu in userStore.menuList" :key="menu.id">
            <el-menu-item
              :index="menu.routePath"
              v-if="!menu.children || menu.children.length == 0"
            >
              <template #title>{{ menu.name }}</template>
            </el-menu-item>
            <el-sub-menu :index="menu.routePath" v-else>
              <template #title>{{ menu.name }}</template>
              <el-menu-item
                v-for="subMenu in menu.children"
                :key="subMenu.id"
                :index="subMenu.routePath"
              >
                <template #title>{{ subMenu.name }}</template>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </aside>
      <main>
        <nav>导航</nav>
        <section class="routerContent">
          <router-view></router-view>
        </section>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useUserStore from "../login/store/userStore";

const userStore = useUserStore();
const selectedMenuIndex = ref("/index/dashboard");

function menuSelect(index: string) {
  console.log("index: ", index);
}
</script>

<style scoped lang="scss">
.namedIcon {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.container {
  height: 100%;

  > header {
    height: 50px;
    color: white;
    background-color: $secondColor;
  }

  .body {
    display: flex;
    height: 100%;

    > aside {
      height: 100%;
      width: 200px;
      color: white;

      .el-menu {
        width: 100%;
        height: 100%;
      }
    }

    > main {
      flex: 1;
      height: 100%;

      nav {
        height: 32px;
      }
      .routerContent {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
