<template>
  <span
    :style="urlIconStyle"
    class="svg-external-icon svg-icon"
    :class="className"
    v-if="isExternal"
  ></span>
  <svg class="svg-icon" aria-hidden="true" v-bind="$attrs" v-else>
    <use :xlink-href="'#icon-' + icon"></use>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

// 定义图标，类名
const props = defineProps<{ icon: string; className?: string }>();

// 是否为外部资源
const isExternal = computed(() => props.icon.startsWith("http"));

// 外部资源样式
const urlIconStyle = computed(() => ({
  mask: `url(${props.icon}) no-repeat 50% 50%`,
  "-webkit-mask": `url(${props.icon}) no-repeat 50% 50%`,
}));
</script>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
}
</style>
