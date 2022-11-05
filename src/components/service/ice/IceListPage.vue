<template>
  <ListPage
    :page="iceListPage"
    :page-size="10"
    :page-count="iceStore.pageCount"
    :total="iceStore.totalSize"
    @search="onSearch"
  >
    <template #search>
      <div class="search-item">
        <el-input
          placeholder="输入job的id"
          :prefix-icon="Search"
          v-model="searchName"
          :formatter="(value: string) => value.replace(/\s/g, '')"
          clearable
        ></el-input>
      </div>
    </template>
  </ListPage>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { DialogConfig, Model } from "@/components/views/data-dialog";
import { SearchParams } from "@/components/views/list-page";
import ListPage from "@/components/views/ListPage.vue";
import { iceListPage } from "./config/ice-list-page";
import { useIceStore } from "./store/iceStore";

const searchName = ref("");
const iceStore = useIceStore();

function onSearch(params: SearchParams, tableData: Ref<Model[]>) {
  iceStore
    .fetchPage({
      pageStart: params.searchIndex,
      pageSize: 10,
      order: -1,
    })
    .then(() => (tableData.value = iceStore.jobInfoList));
}
</script>

<style scoped>
.search-item {
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>
