<template>
  <div class="tag-container" v-horizontal-scroll>
    <el-tag
      v-for="tag in tagList"
      :key="tag.path"
      :effect="tag.active ? 'dark' : 'light'"
      :closable="tag.closable"
      @close.stop="removeTag(tag.path)"
      @click="selectTag(tag.path)"
      >{{ tag.title }}</el-tag>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHomeStore } from "../store/homeStore";

const homeStore = useHomeStore();
const { selectedMenuIndex, tagList } = storeToRefs(homeStore);
const router = useRouter();
const route = useRoute();

// 页面刷新前先执行
window.addEventListener("beforeunload", () => {
  homeStore.updateCacheMenuInfo();
});

// 点击标签加载路由
function selectTag(path: string) {
  if (selectedMenuIndex.value != path) {
    const preRoutePath = router.currentRoute.value.path;
    selectedMenuIndex.value = path;
    router.push(path);
    // 激活路由
    homeStore.activeRouteTagInfo(preRoutePath, path);
  }
}

function removeTag(path: string) {
  const tags = tagList.value;
  let activePath = selectedMenuIndex.value;
  if (activePath === path) {
    tags.forEach((tag, index) => {
      if (tag.path === path) {
        const nextTag = tags[index + 1] || tags[index - 1];
        if (nextTag) {
          activePath = nextTag.path;
        }
      }
    });
  }
  tagList.value = tags.filter((tag) => tag.path !== path);
  selectTag(activePath);
}

// watch监听路由的path
watch(
  () => route.path,
  (activePath, preRoutePath) => {
    selectedMenuIndex.value = activePath;
    homeStore.addOrUpdateTagInfo(preRoutePath, {
      title: route.meta.title as string,
      path: activePath,
      active: true,
      closable: activePath != tagList.value[0].path,
    });
  }
);
</script>

<style scoped lang="scss">
.tag-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 0 20px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }

  .el-tag {
    cursor: pointer;
    user-select: none;
    margin-right: 15px;
    line-height: 32px;
  }

  .el-tag:hover {
    border: 1px solid $textHighBrightColor;
  }
}
</style>
