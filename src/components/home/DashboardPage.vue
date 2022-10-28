<template>
  <Suspense>
    <template #default>
      <DanceNumber ref="asyncTarget"></DanceNumber>
    </template>
    <template #fallback>
      <div>
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
        <div class="chart-container">
          <el-card class="chart-part chart-part-left">
            <el-skeleton :rows="5" animated />
          </el-card>
          <el-card class="chart-part chart-part-left">
            <el-skeleton :rows="5" animated />
          </el-card>
        </div>
        <div class="chart-container">
          <el-card class="chart-part chart-part-left">
            <el-skeleton :rows="5" animated />
          </el-card>
          <el-card class="chart-part chart-part-left">
            <el-skeleton :rows="5" animated />
          </el-card>
        </div>
      </div>
    </template>
  </Suspense>
  <div class="chart-container" v-if="targetIsVisible">
    <el-card class="chart-part chart-part-left">
      <TopicsPie></TopicsPie>
    </el-card>
    <el-card class="chart-part chart-part-right">
      <BucketsPie></BucketsPie>
    </el-card>
  </div>
  <div class="chart-container" v-if="targetIsVisible">
    <el-card class="chart-part chart-part-left">
      <QueueBar></QueueBar>
    </el-card>
    <el-card class="chart-part chart-part-right">
      <DaysStatGrid></DaysStatGrid>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, onUnmounted, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import TopicsPie from "./views/TopicsPie.vue";
import BucketsPie from "./views/BucketsPie.vue";
import QueueBar from "./views/QueueBar.vue";
import DaysStatGrid from "./views/DaysStatGrid.vue";

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
</script>

<style scoped lang="scss">
.chart-container {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
.chart-part {
  width: 50%;
  height: 320px;
}
.chart-part-left {
  margin-right: 5px;
}
.chart-part-right {
  margin-left: 5px;
}
</style>
