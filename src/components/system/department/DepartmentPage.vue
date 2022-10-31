<template>
  <el-card>
    <el-row :gutter="24">
      <el-col :span="6">
        <el-input
          placeholder="输入部门名称"
          :prefix-icon="Search"
          v-model="searchDepartmentName"
          :formatter="(value: string) => value.replace(/\s/g, '')"
          clearable
        ></el-input>
      </el-col>
      <el-col :span="10">
        <el-date-picker
          v-model="searchDate"
          type="daterange"
          value-format="YYYY-MM-DD HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-value="[new Date(2022, 0, 1), new Date(2022, 1, 1)]"
        />
      </el-col>
      <el-col :span="4">
        <el-button :icon="Search" @click="search">搜索</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px">
      <el-button :icon="Plus" color="#52C37D" style="color: white"
        >新增</el-button
      >
    </el-row>
    <el-table
      :data="tableData"
      style="width: 100%; margin-top: 10px"
      max-height="250"
      row-key="id"
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="departmentName" label="名称" />
      <el-table-column fixed="right" label="Operations">
        <template #default="scope">
          <div style="display: flex">
            <el-button :icon="Edit" color="#EAFD57"></el-button>
            <el-button
              :icon="Delete"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search, Plus, Edit, Delete } from "@element-plus/icons-vue";
import { Department, useDepartmentStore } from "./store/departmentStore";

const searchDepartmentName = ref("");
const searchDate = ref<Date[]>();
const tableData = ref(<Department[]>[]);

const departmentStore = useDepartmentStore();
search();

function search() {
  departmentStore
    .fetchPage({
      pageStart: 1,
      pageSize: 10,
      startDate: searchDate.value?.[0],
      endDate: searchDate.value?.[1],
      entity: {
        departmentName: searchDepartmentName.value,
      },
    })
    .then((_) => (tableData.value = departmentStore.departmentList));
}

const handleDelete = (index: number, row: any) => {
  console.log(index, row);
};
</script>

<style scoped></style>
