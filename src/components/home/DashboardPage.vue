<template>
  <AsyncComponent :component="() => import('./views/DanceNumber.vue')">
    <template #deps>
      <div class="chart-container">
        <el-card class="chart-part chart-part-left">
          <TopicsPie></TopicsPie>
        </el-card>
        <el-card class="chart-part chart-part-right">
          <BucketsPie></BucketsPie>
        </el-card>
      </div>
      <div class="chart-container">
        <el-card class="chart-part chart-part-left">
          <QueueBar></QueueBar>
        </el-card>
        <el-card class="chart-part chart-part-right">
          <DaysStatGrid></DaysStatGrid>
        </el-card>
      </div>
    </template>
    <template #placeholder>
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
  </AsyncComponent>
</template>

<script setup lang="ts" title="dashboard">
import TopicsPie from "./views/TopicsPie.vue";
import BucketsPie from "./views/BucketsPie.vue";
import QueueBar from "./views/QueueBar.vue";
import DaysStatGrid from "./views/DaysStatGrid.vue";
import AsyncComponent from "../views/AsyncComponent.vue";
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
