<template>
  <div id="bar-queues" style="width: 100%; height: 320px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { useDashboardStore, KVItem } from "../store/dashboardStore";

import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const dashboardStore = useDashboardStore();
const { jobStatInfo } = storeToRefs(dashboardStore);

onMounted(() => {
  load();
});

function load() {
  const queueBar = echarts.init(
    document.getElementById("bar-queues") as HTMLElement
  );

  const option = {
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
    xAxis: {
      type: "category",
      data: ["job pool", "ready queue", "dead queue"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "数量",
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
  queueBar.setOption(option);
}
</script>

<style scoped></style>
