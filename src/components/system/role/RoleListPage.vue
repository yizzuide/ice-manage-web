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

const rolePageConfig = ref(roleListPageConfig);
// const showAssignDialog = ref(false);
// const assignConfig = ref(assignDialogConfig);

const roleStore = useRoleStore();

const pageProxyHandler = usePageProxyHandler<ModifierRole, Role>({
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
  onOperation(name, dialogConfig, selectedRow?) {},
});
</script>

<style scoped></style>
