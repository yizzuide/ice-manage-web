<template>
  <el-row>
    <el-tag
      v-for="tag in tagList"
      :key="tag.path"
      :effect="tag.active ? 'dark' : 'light'"
      :closable="tag.closable"
      @close.stop="removeTag(tag.path)"
      @click="selectTag(tag.path)"
      >{{ tag.title }}</el-tag
    >
  </el-row>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";

import { useHomeStore } from "../store/homeStore";
import { IRouteChange, RouteTagInfo } from "../types/route-info";

const homeStore = useHomeStore();
const { selectedMenuIndex, tagList } = storeToRefs(homeStore);
const router = useRouter();

// 点击标签加载路由
function selectTag(path: string) {
  if (selectedMenuIndex.value != path) {
    const preRoutePath = router.currentRoute.value.path;
    selectedMenuIndex.value = path;
    homeStore.updateCacheMenuIndex();
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

const handleChangeRoute: IRouteChange = (
  preRoutePath: string,
  route: RouteLocationNormalizedLoaded
) => {
  if (preRoutePath == route.path) {
    return;
  }
  homeStore.addOrUpdateTagInfo(preRoutePath, {
    title: route.meta.title as string,
    path: route.path,
    active: true,
    closable: route.path != tagList.value[0].path,
  });
};
defineExpose({ handleChangeRoute });
</script>

<style scoped lang="scss">
.el-row {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
  overflow-x: scroll;

  .el-tag {
    cursor: pointer;
    margin-right: 15px;
  }
}
</style>
