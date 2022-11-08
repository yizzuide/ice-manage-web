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
let reqParams: SearchParams<Model>;

function onSearch(params: SearchParams<Model>, tableData: Ref<Model[]>) {
  reqParams = params;
  tableDataRef = tableData;
  menuStore
    .fetchPage({
      pageStart: params.searchIndex,
      pageSize: 10,
      startDate: params.searchDate?.[0],
      endDate: params.searchDate?.[1],
      entity: {
        label: params.searchKeyName,
      },
    })
    .then(() => (tableData.value = menuStore.menuList));
}

function onOperation(
  name: OperationNamed,
  dialogConfig: Ref<DialogConfig<Model>>,
  selectedRow?: Model
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
    // 复制对象属性过滤之：解构剩余参数（适用于排除的参数小于5个）
    const { parentId, parentName, createTime, children, ...updateParams } =
      selectedRow as Menu;
    config.model = updateParams;
    return;
  }
  if (name == "remove") {
    menuStore.removeRecord(selectedRow!.id).then((data) => {
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
