<template>
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
    <el-card class="part part-left">
      <TopicsPie></TopicsPie>
    </el-card>
    <el-card class="part part-right">
      <BucketsPie></BucketsPie>
    </el-card>
  </div>
  <div class="footerContent" v-if="targetIsVisible">
    <el-card class="part part-left">
      <QueueBar></QueueBar>
    </el-card>
    <el-card class="part part-right">
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
.middleContent {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;

  .part {
    width: 50%;
    height: 320px;
  }
  .part-left {
    margin-right: 5px;
  }
  .part-right {
    margin-left: 5px;
  }
}
.footerContent {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;

  .part {
    width: 50%;
    height: 320px;
  }
  .part-left {
    margin-right: 5px;
  }
  .part-right {
    margin-left: 5px;
  }
}
</style>
