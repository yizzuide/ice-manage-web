<template>
  <ListPage
    :page="userPageConfig"
    :page-count="usersStore.pageCount"
    :total="usersStore.totalSize"
    @search="onSearch"
    @operation="onOperation"
  >
  </ListPage>
</template>

<script setup lang="ts">
import { DialogConfig, Model } from "@/components/views/data-dialog";
import { OperationNamed, SearchParams } from "@/components/views/list-page";
import ListPage from "@/components/views/ListPage.vue";
import { ref, Ref, watch } from "vue";
import { ModifierUser, initDialogData } from "./config/user-data-dialog";
import { userListPage } from "./config/user-list-page";
import { User, useUsersStore } from "./store/usersStore";
import { useDepartmentStore } from "@/components/system/department/store/departmentStore";

const userPageConfig = ref(userListPage);

const usersStore = useUsersStore();
const departmentStore = useDepartmentStore();
let tableDataRef: Ref<Model[]>;
let reqParams: SearchParams;

// init load department list
if (!departmentStore.departmentAllTree.length) {
  departmentStore
    .fetchAll()
    .then((_) =>
      initDialogData(userPageConfig, departmentStore.departmentAllTree)
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
    usersStore.removeRecord(selectedRow!.id).then((_) => {
      onSearch(reqParams, tableDataRef);
    });
  }
}
</script>

<style scoped></style>
