<template>
  <div id="pie-topics" style="width: 350px; height: 280px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { useDashboardStore, KVItem } from "../store/dashboardStore";

import { onMounted } from "vue";
import { storeToRefs } from "pinia";

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

onMounted(() => {
  load();
});

function load() {
  const topicsPie = echarts.init(
    document.getElementById("pie-topics") as HTMLElement
  );

  const option = {
    title: {
      text: "Topic的Job数据统计",
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
  topicsPie.setOption(option);
}
</script>

<style scoped></style>
