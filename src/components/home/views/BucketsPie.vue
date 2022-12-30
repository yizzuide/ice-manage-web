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
const keys = Object.keys(jobStatInfo.value.delayBuckets);
const pieData: KVItem[] = [];
keys.forEach((key) => {
  pieData.push({
    name: key,
    value: jobStatInfo.value.delayBuckets[key as keyof KVItem] as number,
  });
});

const options: EChartsOption = {
  title: {
    text: "延迟分桶任务统计",
    subtext: "Ice的JobStat分析",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    top: "50",
    right: "0",
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      //dataView: { show: true, readOnly: false },
      //restore: { show: true },
      //saveAsImage: { show: true },
    },
  },
  series: [
    {
      name: "Index of Buckets",
      type: "pie",
      radius: [25, 110],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 0,
      },
      data: pieData,
    },
  ],
};
</script>

<style scoped></style>
