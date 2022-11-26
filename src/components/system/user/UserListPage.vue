<template>
  <div>
    <ListPage
      :page="userPageConfig"
      :page-count="usersStore.pageCount"
      :total="usersStore.totalSize"
      @search="onSearch"
      @operation="onOperation"
      @select-row="onSelectRow"
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
      @close="onAssignDialogClose"
    ></DataDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import varColor from "@/styles/define.module.scss";
import ListPage from "@/components/views/ListPage.vue";
import { DialogConfig, Model } from "@/components/views/data-dialog";
import { OperationNamed, SearchParams } from "@/components/views/list-page";
import {
  ModifierUser,
  initDialogData as initUserDialogData,
} from "./config/user-data-dialog";
import {
  assignDialogConfig,
  UserRole,
  initDialogData as initAssignDialogData,
} from "./config/assign-data-dialog";
import { userListPage } from "./config/user-list-page";
import { User, useUsersStore } from "./store/usersStore";
import { useDepartmentStore } from "@/components/system/department/store/departmentStore";
import { useRoleStore } from "@/components/system/role/store/roleStore";
import DataDialog from "@/components/views/DataDialog.vue";
import usePermission from "@/components/login/hooks/usePermission";
import { ElMessage } from "element-plus";
import { useUserInfo } from "@/components/login/hooks/useUserInfo";

const userPageConfig = ref(userListPage);
const showAssignDialog = ref(false);
const assignConfig = ref(assignDialogConfig);

const usersStore = useUsersStore();
const departmentStore = useDepartmentStore();
const roleStore = useRoleStore();
let currentSelectedUser: User;
let tableDataRef: Ref<Model[]>;
let reqParams: SearchParams;

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
    .then(() => initAssignDialogData(assignConfig, roleStore.rolesAllSource));
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

function onSelectRow(selectedRow: Model) {
  currentSelectedUser = selectedRow as User;
}

function onSearch(searchParams: SearchParams, tableData: Ref<Model[]>) {
  reqParams = searchParams;
  tableDataRef = tableData;
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
}

function onOperation(
  name: OperationNamed,
  dialogConfig: Ref<DialogConfig<Model>>,
  selectedRow?: Model
) {
  const config = (dialogConfig as Ref<DialogConfig<ModifierUser>>).value;
  if (name === "add") {
    config.title = "添加用户";
    config.request.url = "/api/manage/user/add";
    config.request.method = "post";
    config.model = <ModifierUser>{
      gender: 0,
      departmentId: 1,
    };
    if (selectedRow) {
      const selectedUser = selectedRow as User;
      config.model.departmentId = selectedUser.departmentId;
    }
    return;
  }
  if (name == "edit") {
    config.title = "修改用户";
    config.request.url = "/api/manage/user/update";
    config.request.method = "put";
    const { departmentName, ...updateParams } = selectedRow as ModifierUser;
    const autoSetDepartName = config.model.departmentName;
    config.model = { departmentName: autoSetDepartName, ...updateParams };
    return;
  }
  if (name == "remove") {
    if (selectedRow!.isAdmin) {
      ElMessage.warning("超级管理员用户不能删除！");
      return;
    }
    usersStore.removeRecord(selectedRow!.id).then((_) => {
      onSearch(reqParams, tableDataRef);
    });
  }
}

async function onAssign() {
  if (!currentSelectedUser) {
    ElMessage.warning("请选择用户！");
    return;
  }
  const roleIds = await roleStore.findRoleIds(currentSelectedUser.id);
  assignConfig.value.model = <UserRole>{
    uid: currentSelectedUser.id,
    roleIds,
  };
  showAssignDialog.value = true;
}

function onAssignDialogClose(finish: boolean) {
  showAssignDialog.value = false;
  if (finish) {
    onSearch(reqParams, tableDataRef);
  }
}
</script>

<style scoped></style>
