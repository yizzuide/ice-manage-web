<template>
  <div ref="contentRef" :style="{ width, height }"></div>
</template>

<script setup lang="ts">
import useEcharts from "@/hooks/useEcharts";
import { EChartsOption } from "echarts";
import { onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{ options: EChartsOption; width?: string; height?: string }>(),
  {
    width: "100%",
    height: "280px",
  }
);
const contentRef = ref<HTMLElement>();
onMounted(() => {
  useEcharts(contentRef.value!).setOptions(props.options);
});
</script>

<style scoped></style>
