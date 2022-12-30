<template>
  <Echarts :options="options"></Echarts>
</template>

<script setup lang="ts">
import varColor from "@/styles/define.module.scss";
import { EChartsOption } from "echarts";
import Echarts from "@/components/views/Echarts.vue";
import { storeToRefs } from "pinia";
import { useDashboardStore, KVItem } from "../store/dashboardStore";

const dashboardStore = useDashboardStore();
const { jobStatInfo } = storeToRefs(dashboardStore);

const periodKeys = Object.keys(jobStatInfo.value.successDaysCount);
const successData: number[] = [];
const failData: number[] = [];
periodKeys.forEach((key) => {
  successData.push(
    jobStatInfo.value.successDaysCount[key as keyof KVItem] as number
  );
  failData.push(jobStatInfo.value.failDaysCount[key as keyof KVItem] as number);
});
// 修改最后一个时间的显示
periodKeys.pop();
periodKeys.push("今天");

const options: EChartsOption = {
  title: {
    text: "五天任务处理结果统计",
    subtext: "Ice的JobStat分析",
    left: "center",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    orient: "vertical",
    top: "15",
    right: "0",
    data: ["处理成功", "处理失败"],
  },
  grid: {
    left: "3%",
    right: "3%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: periodKeys,
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "处理成功",
      type: "line",
      stack: "Total",
      color: varColor.successColor,
      data: successData,
    },
    {
      name: "处理失败",
      type: "line",
      stack: "Total",
      color: varColor.dangerColor,
      data: failData,
    },
  ],
};
</script>

<style scoped></style>
