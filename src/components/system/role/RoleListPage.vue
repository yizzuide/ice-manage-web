<template>
  <div>
    <ListPage
      :page="rolePageConfig"
      :page-count="roleStore.pageCount"
      :total="roleStore.totalSize"
      @search="pageProxyHandler.onSearch"
      @operation="pageProxyHandler.onOperation"
      @select-row="pageProxyHandler.onSelectRow"
    >
    </ListPage>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import varColor from "@/styles/define.module.scss";
import ListPage from "@/components/views/ListPage.vue";
import DataDialog from "@/components/views/DataDialog.vue";
import { roleListPageConfig } from "./config/role-list-page";
import { Role, useRoleStore } from "./store/roleStore";
import { usePageProxyHandler } from "@/components/views/pageProxyHandler";
import { ModifierRole } from "./config/role-data-dialog";
import { ElMessage } from "element-plus";
import { useUsersStore } from "../user/store/usersStore";

const rolePageConfig = ref(roleListPageConfig);
// const showAssignDialog = ref(false);
// const assignConfig = ref(assignDialogConfig);

const roleStore = useRoleStore();
const usersStore = useUsersStore();

const pageProxyHandler = usePageProxyHandler<ModifierRole, Role>({
  init() {
    if (!usersStore.usersAllSource.length) {
      usersStore.fetchAll().then(() => pageProxyHandler.refresh());
    }
  },
  onSearch(searchParams, tableData) {
    roleStore
      .fetchPage({
        pageStart: searchParams.searchIndex,
        pageSize: searchParams.searchPageSize,
        entity: {
          roleName: searchParams.searchKeyName,
        },
      })
      .then(() => (tableData.value = roleStore.roleList));
  },
  onOperation(name, dialogConfig, selectedRow?) {
    const config = dialogConfig.value;
    if (name === "add") {
      config.title = "添加角色";
      config.request.url = "/api/manage/role/add";
      config.request.method = "post";
      config.model = <ModifierRole>{};
      return;
    }
    if (name == "edit") {
      config.title = "修改角色";
      config.request.url = "/api/manage/role/update";
      config.request.method = "put";
      const { createUser, createTime, ...updateParams } = selectedRow!;
      config.model = updateParams as ModifierRole;
      return;
    }
    if (name == "remove") {
      if (selectedRow!.id === 1) {
        ElMessage.warning("超级管理员角色不能删除！");
        return;
      }
      roleStore.removeRecord(selectedRow!.id).then((data) => {
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
