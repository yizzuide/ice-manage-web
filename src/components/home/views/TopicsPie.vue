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
const keys = Object.keys(jobStatInfo.value.topics);
const pieData: KVItem[] = [];
keys.forEach((key) => {
  pieData.push({
    name: key,
    value: jobStatInfo.value.topics[key as keyof KVItem] as number,
  });
});

const options: EChartsOption = {
  title: {
    text: "任务的topic数量统计",
    subtext: "Ice的JobStat分析",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "horizontal",
    bottom: "15",
  },
  series: [
    {
      name: "Topic",
      type: "pie",
      radius: "50%",
      data: pieData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};
</script>

<style scoped></style>
