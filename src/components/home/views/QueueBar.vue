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
      show: true,
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
        data: [
          jobStatInfo.value.jobPoolCount,
          jobStatInfo.value.readyQueueCount,
          jobStatInfo.value.deadQueueCount,
        ],
        type: "bar",
        colorBy: "data",
      },
    ],
  };
  queueBar.setOption(option);
}
</script>

<style scoped></style>
