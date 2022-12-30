<template>
  <Echarts :options="options"></Echarts>
</template>

<script setup lang="ts">
import { EChartsOption } from "echarts";
import Echarts from "@/components/views/Echarts.vue";
import { storeToRefs } from "pinia";
import { useDashboardStore, KVItem } from "../store/dashboardStore";

const dashboardStore = useDashboardStore();
const { jobStatInfo } = storeToRefs(dashboardStore);

const options: EChartsOption = {
  title: {
    text: "各队列的任务统计",
    subtext: "Ice的JobStat分析",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow", // line, cross
    },
  },
  // 设置内容边距
  grid: {
    left: "3%",
    right: "3%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: ["Job pool", "Ready queue", "Dead queue"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "任务数量",
      type: "bar",
      colorBy: "data",
      data: [
        jobStatInfo.value.jobPoolCount,
        jobStatInfo.value.readyQueueCount,
        jobStatInfo.value.deadQueueCount,
      ],
    },
  ],
};
</script>

<style scoped></style>
