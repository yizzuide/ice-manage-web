<template>
  <div>
    数字动画：总job添加数量，总job处理成功数量，当天job添加数量，当天job处理成功数量
  </div>
  <div>饼图：每个topic的job数量，delay bucket的job数量</div>
  <div>柱状图：job pool数量, ready queue的job数量，dead queue的job数量</div>
  <div>折线图：显示每天（共五天）的job处理成功数量与失败数量</div>
  <Suspense>
    <template #default>
      <DanceNumber ref="asyncTarget"></DanceNumber>
    </template>
    <template #fallback>
      <el-row :gutter="24">
        <el-col :span="6"
          ><el-card><el-skeleton :rows="1" animated /></el-card
        ></el-col>
        <el-col :span="6"
          ><el-card><el-skeleton :rows="1" animated /></el-card
        ></el-col>
        <el-col :span="6"
          ><el-card><el-skeleton :rows="1" animated /></el-card
        ></el-col>
        <el-col :span="6"
          ><el-card><el-skeleton :rows="1" animated /></el-card
        ></el-col>
      </el-row>
    </template>
  </Suspense>
  <div class="middleContent" v-if="targetIsVisible">
    <el-card class="part">
      <TopicsPie></TopicsPie>
    </el-card>
    <el-card class="part">
      <BucketsPie></BucketsPie>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import TopicsPie from "./views/TopicsPie.vue";
import BucketsPie from "./views/BucketsPie.vue";
import { useDashboardStore } from "./store/dashboardStore";
import { storeToRefs } from "pinia";

// 定义异步组件，与Suspense联合使用
const DanceNumber = defineAsyncComponent(
  () => import("./views/DanceNumber.vue")
);
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

const dashboardStore = useDashboardStore();
const { jobStatInfo } = storeToRefs(dashboardStore);
</script>

<style scoped lang="scss">
.middleContent {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;

  .part {
    width: 50%;
    height: 320px;
  }
}
</style>
