<template>
  <el-row :gutter="24">
    <el-col :span="6">
      <el-card shadow="hover" class="dance-number-content">
        <div class="dance-number">{{ counter.total }}</div>
        <div class="number-label">总job添加数量</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="dance-number-content">
        <div class="dance-number">{{ counter.finishTotal }}</div>
        <div class="number-label">总job处理成功数量</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="dance-number-content">
        <div class="dance-number">{{ counter.todayCount }}</div>
        <div class="number-label">今天job添加数量</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="dance-number-content">
        <div class="dance-number">{{ counter.finishTodayCount }}</div>
        <div class="number-label">今天job处理成功数量</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { reactive } from "vue";
import { useDashboardStore } from "../store/dashboardStore";
import useDanceNumber from "@/hooks/useDanceNumber";

const dashboardStore = useDashboardStore();
const { jobStatInfo } = storeToRefs(dashboardStore);

const counter = reactive({
  total: 0,
  finishTotal: 0,
  todayCount: 0,
  finishTodayCount: 0,
});

// 等待请求job统计数据（数据由pinia统一管理）
await dashboardStore.fetchJobStatInfo();
// 显示数字动画
useDanceNumber(counter, jobStatInfo).start(0.5);
</script>

<style scoped lang="scss">
.dance-number-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 80px;
  text-align: center;

  .dance-number {
    font-size: large;
    font-weight: 700;
    color: $primaryColor;
  }

  .number-label {
    margin-top: 15px;
    color: #aaaaaa;
  }
}
</style>
