<template>
  <Suspense>
    <template #default>
      <div ref="asyncTarget">
        <component :is="asyncCompInstance"></component>
      </div>
    </template>
    <template #fallback>
      <slot name="placeholder"></slot>
    </template>
  </Suspense>
  <!-- 依赖异步组件的相关组件，只有异步组件加载完才会加载 -->
  <div v-if="targetIsVisible">
    <slot name="deps"></slot>
  </div>
</template>

<script setup lang="ts">
import {
  AsyncComponentLoader,
  defineAsyncComponent,
  onUnmounted,
  ref,
} from "vue";
// 依赖安装：npm i @vueuse/core -S
import { useIntersectionObserver } from "@vueuse/core";
// 加载异步组件
const props = defineProps<{ component: AsyncComponentLoader }>();
const asyncCompInstance = defineAsyncComponent(props.component);

// 监控异步组件交互是否可用
const asyncTarget = ref();
const targetIsVisible = ref(false);
const { stop } = useIntersectionObserver(
  asyncTarget,
  ([{ isIntersecting }]) => {
    // isIntersecting 是否进入可视区域
    if (isIntersecting) {
      targetIsVisible.value = isIntersecting;
    }
  }
);
onUnmounted(() => stop());
</script>

<style scoped></style>
