<template>
  <el-row :gutter="24">
    <el-col :span="6">
      <el-card shadow="hover" class="dance-number-content">
        <div class="dance-number">{{ danceNumber.total }}</div>
        <div class="number-label">总job添加数量</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="dance-number-content">
        <div class="dance-number">{{ danceNumber.finishTotal }}</div>
        <div class="number-label">总job执行成功数量</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="dance-number-content">
        <div class="dance-number">{{ danceNumber.todayCount }}</div>
        <div class="number-label">今天job添加数量</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" class="dance-number-content">
        <div class="dance-number">{{ danceNumber.finishTodayCount }}</div>
        <div class="number-label">今天job执行成功数量</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { reactive, watchEffect } from "vue";
import { useDashboardStore } from "../store/dashboardStore";
import gsap from "gsap";
import { toNumber } from "lodash";

const dashboardStore = useDashboardStore();
const { jobStatInfo } = storeToRefs(dashboardStore);

const danceNumber = reactive({
  total: 0,
  finishTotal: 0,
  todayCount: 0,
  finishTodayCount: 0,
});

// 请求job统计数据
await dashboardStore.fetchJobStatInfo();

// 显示数字动画
watchEffect(
  () => {
    showDanceNumber("total", jobStatInfo.value.total);
    showDanceNumber("finishTotal", jobStatInfo.value.finishTotal);
    showDanceNumber("todayCount", jobStatInfo.value.todayCount);
    showDanceNumber("finishTodayCount", jobStatInfo.value.finishTodayCount);
  },
  {
    flush: "post",
  }
);

function showDanceNumber(field: string, targetValue: number) {
  gsap.to(danceNumber, {
    duration: 1,
    [field]: targetValue ?? 0,
    onUpdate: () => {
      danceNumber[field as keyof typeof danceNumber] = toNumber(
        danceNumber[field as keyof typeof danceNumber].toFixed(0)
      );
    },
  });
}
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
