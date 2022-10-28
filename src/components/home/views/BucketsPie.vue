<template>
  <div id="pie-buckets" style="width: 100%; height: 280px"></div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { useDashboardStore, KVItem } from "../store/dashboardStore";

import { onMounted } from "vue";
import { storeToRefs } from "pinia";

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

onMounted(() => {
  load();
});

function load() {
  const bucketsPie = echarts.init(
    document.getElementById("pie-buckets") as HTMLElement
  );

  const option = {
    title: {
      text: "延迟分桶数量统计",
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
  bucketsPie.setOption(option);
}
</script>

<style scoped></style>
