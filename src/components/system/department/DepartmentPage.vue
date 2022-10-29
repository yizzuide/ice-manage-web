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
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-value="[new Date(2022, 0, 1), new Date(2022, 1, 1)]"
        />
      </el-col>
      <el-col :span="4">
        <el-button :icon="Search">搜索</el-button>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px">
      <el-button :icon="Plus" color="#52C37D" style="color: white"
        >新增</el-button
      >
    </el-row>
    <el-table
      :data="tableData"
      table-layout="fixed"
      style="width: 100%; margin-top: 10px"
      max-height="250"
      row-key="id"
      default-expand-all
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" width="120" />
      <el-table-column sortable prop="date" label="时间" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <div style="display: flex">
            <el-button :icon="Edit" type="warning"></el-button>
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

const searchDepartmentName = ref("");
const searchDate = ref("");

interface User {
  id: number;
  date: string;
  name: string;
  hasChildren?: boolean;
  children?: User[];
}

const tableData: User[] = [
  {
    id: 1,
    date: "2016-05-02",
    name: "Morgan",
  },
  {
    id: 2,
    date: "2016-05-04",
    name: "John",
  },
  {
    id: 3,
    date: "2016-05-01",
    name: "Tom",
    children: [
      {
        id: 31,
        date: "2016-05-01",
        name: "Tom 1",
      },
      {
        id: 32,
        date: "2016-05-01",
        name: "Tom 2",
      },
    ],
  },
  {
    id: 4,
    date: "2016-05-03",
    name: "Lisa",
  },
];

const handleDelete = (index: number, row: any) => {
  console.log(index, row);
};
</script>

<style scoped></style>
