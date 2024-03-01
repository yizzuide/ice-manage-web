<template>
  <ListPage
    :page="departListPage"
    :pageCount="departmentStore.pageCount"
    :total="departmentStore.totalSize"
    @search="pageProxyHandler.onSearch"
    @operation="pageProxyHandler.onOperation"
  >
  </ListPage>
</template>

<script setup lang="ts">
import ListPage from "@/components/views/ListPage.vue";
import { usePageProxyHandler } from "@/components/views/pageProxyHandler";
import { ModifierDepartment } from "./config/depart-data-dialog";
import { departListPage } from "./config/depart-list-page";
import { Department, useDepartmentStore } from "./store/departmentStore";

const departmentStore = useDepartmentStore();

const pageProxyHandler = usePageProxyHandler<ModifierDepartment, Department>({
  onSearch(searchParams, tableData) {
    departmentStore
      .fetchPage({
        pageStart: searchParams.searchIndex,
        pageSize: searchParams.searchPageSize,
        startDate: searchParams.searchDate?.[0],
        endDate: searchParams.searchDate?.[1],
        entity: {
          departmentName: searchParams.searchKeyName,
        },
      })
      .then(() => (tableData.value = departmentStore.departmentList));
  },
  async onOperation(name, dialogConfig, selectedRow?) {
    const config = dialogConfig.value;
    if (name === "add") {
      config.title = "添加部门";
      config.desc = "添加子级部门前，需要先选中一个部门！";
      config.request.url = "/api/manage/department/add";
      config.request.method = "post";
      config.model = <ModifierDepartment>{
        pid: 0,
        parentName: "",
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
      config.desc = "";
      config.request.url = "/api/manage/department/update";
      config.request.method = "put";
      // 复制对象属性过滤之：使用箭头函数解构对象（当前为selectedRow），立即执行返回新对象(适用于属性不超过5个)
      config.model = (({ id, departmentName, phone, address, orderNum }) => ({
        id,
        departmentName,
        phone,
        address,
        orderNum,
      }))(selectedRow!);
      return;
    }
    if (name == "remove") {
      await departmentStore.removeRecord(selectedRow!.id);
      pageProxyHandler.refresh();
      return true;
    }
  },
});
</script>

<style scoped lang="scss"></style>
