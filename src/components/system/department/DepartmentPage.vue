<template>
  <ListPage
    :page="departListPage"
    @search="search"
    @operation="operation"
  ></ListPage>
</template>

<script setup lang="ts">
import { useDepartmentStore } from "./store/departmentStore";
import ListPage from "@/components/views/ListPage.vue";
import { departListPage } from "./config/depart-list-page";
import { Model, SearchParams } from "@/components/views/list-page";
import { Ref } from "vue";
import { DialogConfig } from "@/components/views/data-dialog";

const departmentStore = useDepartmentStore();
let tableDataRef: Ref<Model[]>;
let reqParams: SearchParams;

function search(params: SearchParams, tableData: Ref<Model[]>) {
  reqParams = params;
  tableDataRef = tableData;
  departmentStore
    .fetchPage({
      pageStart: 1,
      pageSize: 10,
      startDate: params.searchDate?.[0],
      endDate: params.searchDate?.[1],
      entity: {
        departmentName: params.searchName,
      },
    })
    .then((_) => (tableData.value = departmentStore.departmentList));
}

function operation(
  name: "add" | "edit" | "remove",
  selectedRow: Model,
  dialogConfig: Ref<DialogConfig<Model> | undefined>
) {
  const config = dialogConfig.value!;
  if (name === "add") {
    config.title = "添加部门";
    config.request.url = "/api/department/add";
    config.model = {
      id: null,
      departmentName: "",
      phone: "",
      address: "",
      orderNum: 0,
      parentName: "",
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
    config.model = {
      id: selectedRow.id,
      departmentName: selectedRow.departmentName,
      phone: selectedRow.phone,
      address: selectedRow.address,
      orderNum: selectedRow.orderNum,
    };
    return;
  }
  if (name == "remove") {
    departmentStore
      .removeRecord(selectedRow.id)
      .then(() => search(reqParams, tableDataRef));
  }
}
</script>

<style scoped lang="scss">
.search-row {
  display: flex;
  flex-wrap: wrap;

  .search-item {
    margin-right: 15px;
    margin-bottom: 15px;
  }
}
</style>
