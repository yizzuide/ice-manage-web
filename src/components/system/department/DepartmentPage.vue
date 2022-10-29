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
        <el-button :icon="Search" type="primary">搜索</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Calendar, Search } from "@element-plus/icons-vue";

const searchDepartmentName = ref("");
const searchDate = ref("");
</script>

<style scoped></style>
