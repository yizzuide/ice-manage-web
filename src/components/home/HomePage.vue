<template>
  <div class="container">
    <header>头部</header>
    <section class="body">
      <aside>菜单</aside>
      <main>
        <nav>导航</nav>
        <section>内容</section>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/components/login/store/userStore";
const userStore = useUserStore();
</script>

<style scoped lang="scss">
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
      width: 180px;
      color: white;
      background-color: $darkColor;
    }

    > main {
      flex: 1;
      height: 100%;

      nav {
        height: 32px;
      }
    }
  }
}
</style>
