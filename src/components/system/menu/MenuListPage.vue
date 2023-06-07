<template>
  <ListPage
    :page="menuListPage"
    :total="menuStore.totalSize"
    :page-count="menuStore.pageCount"
    @search="pageProxyHandler.onSearch"
    @operation="pageProxyHandler.onOperation">
    </ListPage>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import ListPage from "@/components/views/ListPage.vue";
import { menuListPage } from "./config/menu-list-page";
import { ModifierMenu } from "./config/menu-data-dialog";
import { Menu, useMenuStore } from "./store/menuStore";
import { usePageProxyHandler } from "@/components/views/pageProxyHandler";

const menuStore = useMenuStore();

const pageProxyHandler = usePageProxyHandler<ModifierMenu, Menu>({
  onSearch(searchParams, tableData) {
    menuStore
      .fetchPage({
        pageStart: searchParams.searchIndex,
        pageSize: -1,
        startDate: searchParams.searchDate?.[0],
        endDate: searchParams.searchDate?.[1],
        entity: {
          label: searchParams.searchKeyName,
        },
      })
      .then(() => (tableData.value = menuStore.menuList));
  },
  onOperation(name, dialogConfig, selectedRow?) {
    const config = dialogConfig.value;
    if (name === "add") {
      config.title = "添加菜单";
      config.request.url = "/api/manage/menu/add";
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
      config.request.url = "/api/manage/menu/update";
      config.request.method = "put";
      // 复制对象属性过滤之：解构剩余参数（适用于排除的参数小于5个）
      const { parentId, parentName, createTime, children, ...updateParams } =
        selectedRow!;
      config.model = updateParams;
      return;
    }
    if (name == "remove") {
      menuStore.removeRecord(selectedRow!.id).then((data) => {
        if (!data.isSuccess) {
          ElMessage.error(data.message);
          return;
        }
        pageProxyHandler.refresh();
      });
    }
  },
});
</script>

<style scoped></style>
