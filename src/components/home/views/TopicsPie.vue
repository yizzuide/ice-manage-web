<template>
  <div
    id="pie-topics"
    ref="pieTopicsRef"
    style="width: 100%; height: 280px"
  ></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { useDashboardStore, KVItem } from "../store/dashboardStore";

import { onMounted, ref } from "vue";
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

const pieTopicsRef = ref<HTMLElement>();
function load() {
  const topicsPie = echarts.init(
    //document.getElementById("pie-topics") as HTMLElement
    pieTopicsRef.value!,
    /* "light" */ undefined, // 主题
    { renderer: "svg" } // 渲染引擎，小数据svg性能更高（特别是在移动端）
  );

  const option = {
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
  topicsPie.setOption(option);
}
</script>

<style scoped></style>
