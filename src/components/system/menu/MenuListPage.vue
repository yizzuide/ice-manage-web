<template>
  <ListPage
    :page="menuListPage"
    :total="menuStore.totalSize"
    :pageCount="menuStore.pageCount"
    @search="pageProxyHandler.onSearch"
    @operation="pageProxyHandler.onOperation">
    </ListPage>
</template>

<script setup lang="ts">
import ListPage from "@/components/views/ListPage.vue";
import { usePageProxyHandler } from "@/components/views/pageProxyHandler";
import { ElMessage } from "element-plus";
import { ModifierMenu } from "./config/menu-data-dialog";
import { menuListPage } from "./config/menu-list-page";
import { Menu, useMenuStore } from "./store/menuStore";

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
  async onOperation(name, dialogConfig, selectedRow?) {
    const config = dialogConfig.value;
    if (name === "add") {
      config.title = "添加菜单";
      config.desc = "添加子菜单前，需要先选中一个菜单！";
      config.request.url = "/api/manage/menu/add";
      config.request.method = "post";
      config.model = <Menu>{
        parentId: 0,
        parentName: "",
        order: 0
      };
      if (selectedRow) {
        config.model.parentName = selectedRow.label;
        config.model.parentId = selectedRow.id;
      }
      
      return;
    }
    if (name == "edit") {
      config.title = "修改菜单";
      config.desc = "";
      config.request.url = "/api/manage/menu/update";
      config.request.method = "put";
      // 复制对象属性过滤之：解构剩余参数（适用于排除的参数小于5个）
      const { parentId, parentName, createTime, children, ...updateParams } =
        selectedRow!;
      config.model = updateParams;
      return;
    }
    if (name == "remove") {
      const data = await menuStore.removeRecord(selectedRow!.id);
      if (!data.isSuccess) {
        ElMessage.error(data.message);
        return;
      }
      pageProxyHandler.refresh();
      return true;
    }
  },
});
</script>

<style scoped></style>
