<template>
  <div>
    <ListPage
      :page="rolePageConfig"
      :pageCount="roleStore.pageCount"
      :total="roleStore.totalSize"
      @search="pageProxyHandler.onSearch"
      @operation="pageProxyHandler.onOperation"
      @select-row="pageProxyHandler.onSelectRow">
      <template #additionCommand>
        <el-button
          :color="varColor.infoColor"
          style="color: white"
          @click="onAssign"
          v-if="usePermission().test(rolePageConfig.perms.assign)">
          分配权限
        </el-button>
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
import usePermission from "@/components/login/hooks/usePermission";
import DataDialog from "@/components/views/DataDialog.vue";
import ListPage from "@/components/views/ListPage.vue";
import { usePageProxyHandler } from "@/components/views/pageProxyHandler";
import varColor from "@/styles/define.module.scss";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { useMenuStore } from "../menu/store/menuStore";
import { useUsersStore } from "../user/store/usersStore";
import {
RolePerm,
assignDialogConfig,
initDialogData as initAssignDialogData,
} from "./config/assign-data-dialog";
import { roleListPageConfig } from "./config/role-list-page";
import { Role, useRoleStore } from "./store/roleStore";

const rolePageConfig = ref(roleListPageConfig);
const showAssignDialog = ref(false);
const assignConfig = ref(assignDialogConfig);

const roleStore = useRoleStore();
const usersStore = useUsersStore();
const menuStore = useMenuStore();

const pageProxyHandler = usePageProxyHandler<Role, Role>({
  init() {
    usersStore.fetchAll().then(() => pageProxyHandler.refresh());
    menuStore.fetchAll().then(() => initAssignDialogData(assignConfig, menuStore.menusAllSource));
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
  async onOperation(name, dialogConfig, selectedRow?) {
    const config = dialogConfig.value;
    if (name === "add") {
      config.title = "添加角色";
      config.request.url = "/api/manage/role/add";
      config.request.method = "post";
      config.model = <Role>{};
      return;
    }
    if (name == "edit") {
      if (selectedRow?.id === 1) {
        ElMessageBox.confirm("超级管理员不能修改角色！");
        selectedRow!.canceled = true;
        return;
      }
      config.title = "修改角色";
      config.request.url = "/api/manage/role/update";
      config.request.method = "put";
      const { createUser, createTime, ...updateParams } = selectedRow!;
      config.model = updateParams;
      return;
    }
    if (name == "remove") {
      if (selectedRow!.id === 1) {
        ElMessageBox.confirm("超级管理员角色不能删除！");
        selectedRow!.canceled = true;
        return;
      }
      await roleStore.removeRecord(selectedRow!.id);
      pageProxyHandler.refresh();
      return true;
    }
  },
});

async function onAssign() {
  const currentSelectedRole = pageProxyHandler.getCurrentSelectedRow();
  if (!currentSelectedRole) {
    ElMessage.warning("请选择角色！");
    return;
  }
  if (currentSelectedRole.id === 1) {
    ElMessageBox.confirm("超级管理员不需要分配权限！");
    return;
  }
  const permIds = await roleStore.findPermIds(currentSelectedRole.id);
  assignConfig.value.model = <RolePerm>{
    roleId: currentSelectedRole.id,
    permIds,
  };
  showAssignDialog.value = true;
}
</script>

<style scoped></style>
