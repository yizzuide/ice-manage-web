<template>
  <ListPage
    :page="menuListPage"
    :page-count="menuStore.pageCount"
    @search="onSearch"
    @operation="onOperation"
  ></ListPage>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { DialogConfig, Model } from "@/components/views/data-dialog";
import { OperationNamed, SearchParams } from "@/components/views/list-page";
import ListPage from "@/components/views/ListPage.vue";
import { menuListPage } from "./config/menu-list-page";
import { Menu, useMenuStore } from "./store/menuStore";
import { ModifierMenu } from "./config/menu-data-dialog";

const menuStore = useMenuStore();

function onSearch(params: SearchParams, tableData: Ref<Model[]>) {
  menuStore
    .fetchPage({
      pageStart: params.searchIndex,
      pageSize: 10,
      startDate: params.searchDate?.[0],
      endDate: params.searchDate?.[1],
      entity: {
        label: params.searchName,
      },
    })
    .then(() => (tableData.value = menuStore.menuList));
}

function onOperation(
  name: OperationNamed,
  selectedRow: Model,
  dialogConfig: Ref<DialogConfig<Model>>
) {
  const config = (dialogConfig as Ref<DialogConfig<ModifierMenu>>).value;
  if (name === "add") {
    config.title = "添加菜单";
    config.request.url = "/api/menu/add";
    config.model = <Menu>{};
    config.model.order = 0;
    if (selectedRow) {
      config.model.parentName = selectedRow.label;
      config.model.parentId = selectedRow.id;
    }
    return;
  }
}
</script>

<style scoped></style>
