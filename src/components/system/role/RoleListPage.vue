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
      <template #additionCommand>
        <el-button
          :color="varColor.infoColor"
          style="color: white"
          @click="onAssign"
          v-if="usePermission().test(rolePageConfig.perms.assign)"
          >分配权限</el-button
        >
      </template>
    </ListPage>
    <DataDialog
      :visible="showAssignDialog"
      :config="assignConfig"
      @close="showAssignDialog = false"
    ></DataDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import varColor from "@/styles/define.module.scss";
import ListPage from "@/components/views/ListPage.vue";
import DataDialog from "@/components/views/DataDialog.vue";
import { roleListPageConfig } from "./config/role-list-page";
import {
  assignDialogConfig,
  RolePerm,
  initDialogData as initAssignDialogData,
} from "./config/assign-data-dialog";
import { Role, useRoleStore } from "./store/roleStore";
import { usePageProxyHandler } from "@/components/views/pageProxyHandler";
import { ModifierRole } from "./config/role-data-dialog";
import { useUsersStore } from "../user/store/usersStore";
import usePermission from "@/components/login/hooks/usePermission";
import { useMenuStore } from "../menu/store/menuStore";

const rolePageConfig = ref(roleListPageConfig);
const showAssignDialog = ref(false);
const assignConfig = ref(assignDialogConfig);

const roleStore = useRoleStore();
const usersStore = useUsersStore();
const menuStore = useMenuStore();

const pageProxyHandler = usePageProxyHandler<ModifierRole, Role>({
  init() {
    if (!usersStore.usersAllSource.length) {
      usersStore.fetchAll().then(() => pageProxyHandler.refresh());
    }
    if (!menuStore.menusAllSource.length) {
      menuStore
        .fetchAll()
        .then(() =>
          initAssignDialogData(assignConfig, menuStore.menusAllSource)
        );
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

async function onAssign() {
  const currentSelectedRole = pageProxyHandler.getCurrentSelectedRow();
  if (!currentSelectedRole) {
    ElMessage.warning("请选择角色！");
    return;
  }
  const permIds = await roleStore.findPermIds(currentSelectedRole.id);
  console.log("permIds", permIds);
  assignConfig.value.model = <RolePerm>{
    roleId: currentSelectedRole.id,
    permIds,
  };
  showAssignDialog.value = true;
}
</script>

<style scoped></style>
