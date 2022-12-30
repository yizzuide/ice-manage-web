<template>
  <el-row :gutter="24">
    <el-col
      :md="normalSpan"
      :sm="miniSpan"
      v-for="index of colCount"
      :key="'gen-col-' + index"
    >
      <slot :name="`col-${index}`"></slot>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  colCount: number;
  className?: string;
  itemVSpacing?: number;
}>();

const normalSpan = computed(() => 24 / props.colCount);
const miniSpan = computed(() => Math.max(normalSpan.value * 2, 24));
const spacing = (props.itemVSpacing ?? 15) + "px";
</script>

<style lang="scss" scoped>
.el-row {
  .el-col {
    margin-bottom: v-bind(spacing);
  }
}
</style>
