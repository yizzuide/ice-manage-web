<template>
  <ListPage
    :page="iceListPage"
    :page-size="10"
    :page-count="iceStore.pageCount"
    :total="iceStore.totalSize"
    @search="onSearch"
  ></ListPage>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { DialogConfig, Model } from "@/components/views/data-dialog";
import { OperationNamed, SearchParams } from "@/components/views/list-page";
import ListPage from "@/components/views/ListPage.vue";
import { iceListPage } from "./config/ice-list-page";
import { useIceStore } from "./store/iceStore";

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

<style scoped></style>
