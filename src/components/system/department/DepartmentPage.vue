<template>
  <ListPage
    :page="departListPage"
    :page-size="10"
    :page-count="departmentStore.pageCount"
    :total="departmentStore.totalSize"
    @search="search"
    @operation="operation"
  >
  </ListPage>
</template>

<script setup lang="ts">
import { Ref } from "vue";
import { departListPage } from "./config/depart-list-page";
import { OperationNamed, SearchParams } from "@/components/views/list-page";
import { DialogConfig, Model } from "@/components/views/data-dialog";
import { ModifierDepartment } from "./config/depart-data-dialog";
import ListPage from "@/components/views/ListPage.vue";
import { useDepartmentStore } from "./store/departmentStore";
import { ElMessage } from "element-plus";

const departmentStore = useDepartmentStore();
let tableDataRef: Ref<Model[]>;
let reqParams: SearchParams<Model>;

function search(params: SearchParams<Model>, tableData: Ref<Model[]>) {
  reqParams = params;
  tableDataRef = tableData;
  departmentStore
    .fetchPage({
      pageStart: 1,
      pageSize: 10,
      startDate: params.searchDate?.[0],
      endDate: params.searchDate?.[1],
      entity: {
        departmentName: params.searchKeyName,
      },
    })
    .then(() => (tableData.value = departmentStore.departmentList));
}

function operation(
  name: OperationNamed,
  dialogConfig: Ref<DialogConfig<Model>>,
  selectedRow?: Model
) {
  const config = (dialogConfig as Ref<DialogConfig<ModifierDepartment>>).value;
  if (name === "add") {
    config.title = "添加部门";
    config.request.url = "/api/department/add";
    config.model = <ModifierDepartment>{
      orderNum: 0,
    };
    if (selectedRow) {
      config.model.parentName = selectedRow.departmentName;
      config.model.pid = selectedRow.id;
    }
    return;
  }

  if (name == "edit") {
    config.title = "修改部门";
    config.request.url = "/api/department/update";
    config.request.method = "put";
    // 复制对象属性过滤之：使用箭头函数解构对象（当前为selectedRow），立即执行返回新对象(适用于属性不超过5个)
    config.model = (({ id, departmentName, phone, address, orderNum }) => ({
      id,
      departmentName,
      phone,
      address,
      orderNum,
    }))(selectedRow as ModifierDepartment);
    return;
  }
  if (name == "remove") {
    departmentStore.removeRecord(selectedRow!.id).then((data) => {
      if (!data.isSuccess) {
        ElMessage.error(data.message);
        return;
      }
      search(reqParams, tableDataRef);
    });
  }
}
</script>

<style scoped lang="scss"></style>
