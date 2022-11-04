<template>
  <ListPage
    :page="menuListPage"
    :total="menuStore.totalSize"
    :page-size="10"
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
import { ElMessage } from "element-plus";

const menuStore = useMenuStore();
let tableDataRef: Ref<Model[]>;
let reqParams: SearchParams;

function onSearch(params: SearchParams, tableData: Ref<Model[]>) {
  reqParams = params;
  tableDataRef = tableData;
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
    (config.model.parentId = 0), (config.model.parentName = "");
    if (selectedRow) {
      config.model.parentName = selectedRow.label;
      config.model.parentId = selectedRow.id;
    }
    return;
  }
  if (name == "edit") {
    config.title = "修改菜单";
    config.request.url = "/api/menu/update";
    config.request.method = "put";
    config.model = {
      id: selectedRow.id,
      label: selectedRow.label,
      icon: selectedRow.icon,
      code: selectedRow.code,
      type: selectedRow.type,
      routePath: selectedRow.routePath,
      routeName: selectedRow.routeName,
      componentPath: selectedRow.componentPath,
      order: selectedRow.order,
    };
    return;
  }
  if (name == "remove") {
    menuStore.removeRecord(selectedRow.id).then((data) => {
      if (!data.isSuccess) {
        ElMessage.error(data.message);
        return;
      }
      onSearch(reqParams, tableDataRef);
    });
  }
}
</script>

<style scoped></style>
