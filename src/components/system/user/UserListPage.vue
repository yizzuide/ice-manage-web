<template>
  <div>
    <ListPage
      :page="userPageConfig"
      :pageCount="usersStore.pageCount"
      :total="usersStore.totalSize"
      @search="pageProxyHandler.onSearch"
      @operation="pageProxyHandler.onOperation"
      @select-row="pageProxyHandler.onSelectRow"
    >
      <template #additionCommand>
        <el-button
          :color="varColor.infoColor"
          style="color: white"
          @click="onAssign"
          v-if="usePermission().test(userPageConfig.perms.assign)"
          >分配角色</el-button
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
import usePermission from "@/components/login/hooks/usePermission";
import { useDepartmentStore } from "@/components/system/department/store/departmentStore";
import { useRoleStore } from "@/components/system/role/store/roleStore";
import DataDialog from "@/components/views/DataDialog.vue";
import ListPage from "@/components/views/ListPage.vue";
import { usePageProxyHandler } from "@/components/views/pageProxyHandler";
import varColor from "@/styles/define.module.scss";
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
import {
UserRole,
assignDialogConfig,
initDialogData as initAssignDialogData,
} from "./config/assign-data-dialog";
import {
ModifierUser,
initDialogData as initUserDialogData,
} from "./config/user-data-dialog";
import { userListPage } from "./config/user-list-page";
import { User, useUsersStore } from "./store/usersStore";

const userPageConfig = ref(userListPage);
const showAssignDialog = ref(false);
const assignConfig = ref(assignDialogConfig);

const usersStore = useUsersStore();
const departmentStore = useDepartmentStore();
const roleStore = useRoleStore();

const pageProxyHandler = usePageProxyHandler<ModifierUser, User>({
  init() {
    // init load department list
    if (!departmentStore.departmentAllTree.length) {
      departmentStore
        .fetchAll()
        .then(() =>
          initUserDialogData(userPageConfig, departmentStore.departmentAllTree)
        );
    }
    if (!roleStore.rolesAllSource.length) {
      roleStore
        .fetchAll()
        .then(() =>
          initAssignDialogData(assignConfig, roleStore.rolesAllSource)
        );
    }
    // set department name while id has change
    watch(
      () => userPageConfig.value.struct.dialogConfig?.model.departmentId,
      (departId) => {
        if (!departId) {
          return;
        }
        // array -> number
        if ((departId as any) instanceof Array) {
          const ids = departId as unknown as [];
          userPageConfig.value.struct.dialogConfig!.model.departmentId =
            ids[ids.length - 1];
          return;
        }
        userPageConfig.value.struct.dialogConfig!.model.departmentName =
          departmentStore.findDepartmentNameById(departId)!;
      }
    );
  },
  onSearch(searchParams, tableData) {
    usersStore
      .fetchPage({
        pageStart: searchParams.searchIndex,
        pageSize: searchParams.searchPageSize,
        entity: {
          username: searchParams.searchKeyName,
          realName: searchParams.realName,
          phone: searchParams.phone,
        },
      })
      .then(() => (tableData.value = usersStore.userList));
  },
  async onOperation(name, dialogConfig, selectedRow?) {
    const config = dialogConfig.value;
    if (name === "add") {
      config.title = "添加用户";
      config.request.url = "/api/manage/user/add";
      config.request.method = "post";
      config.model = <ModifierUser>{
        gender: 0,
        departmentId: 1,
      };
      if (selectedRow) {
        config.model.departmentId = selectedRow.departmentId;
      }
      return;
    }
    if (name == "edit") {
      config.title = "修改用户";
      config.request.url = "/api/manage/user/update";
      config.request.method = "put";
      const {
        password,
        departmentName,
        isAdmin,
        isEnabled,
        createTime,
        ...updateParams
      } = selectedRow!;
      const autoSetDepartName = config.model.departmentName;
      config.model = { departmentName: autoSetDepartName, password: "********", ...updateParams };
      return;
    }
    if (name == "remove") {
      if (selectedRow!.isAdmin) {
        ElMessage.warning("超级管理员用户不能删除！");
        return;
      }
      await usersStore.removeRecord(selectedRow!.id);
      pageProxyHandler.refresh();
      return true;
    }
  },
});

async function onAssign() {
  const currentSelectedUser = pageProxyHandler.getCurrentSelectedRow();
  if (!currentSelectedUser) {
    ElMessage.warning("请选择用户！");
    return;
  }
  const roleIds = await usersStore.findRoleIds(currentSelectedUser.id);
  assignConfig.value.model = <UserRole>{
    uid: currentSelectedUser.id,
    roleIds,
  };
  showAssignDialog.value = true;
}
</script>

<style scoped></style>
