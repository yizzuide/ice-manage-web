<template>
  <AsyncComponent :component="() => import('./views/DanceNumber.vue')">
    <template #deps>
      <Responsive :col-count="2">
        <template v-slot:col-1>
          <el-card>
            <TopicsPie></TopicsPie>
          </el-card>
        </template>
        <template v-slot:col-2>
          <el-card>
            <BucketsPie></BucketsPie>
          </el-card>
        </template>
      </Responsive>
      <Responsive :col-count="2">
        <template v-slot:col-1>
          <el-card>
            <QueueBar></QueueBar>
          </el-card>
        </template>
        <template v-slot:col-2>
          <el-card>
            <DaysStatGrid></DaysStatGrid>
          </el-card>
        </template>
      </Responsive>
    </template>
    <template #placeholder>
      <div>
        <Responsive :col-count="4">
          <template v-slot:col-1>
            <el-card><el-skeleton :rows="1" animated /></el-card>
          </template>
          <template v-slot:col-2>
            <el-card><el-skeleton :rows="1" animated /></el-card>
          </template>
          <template v-slot:col-3>
            <el-card><el-skeleton :rows="1" animated /></el-card>
          </template>
          <template v-slot:col-4>
            <el-card><el-skeleton :rows="1" animated /></el-card>
          </template>
        </Responsive>
        <Responsive :col-count="2">
          <template v-slot:col-1>
            <el-card>
              <el-skeleton :rows="5" animated />
            </el-card>
          </template>
          <template v-slot:col-2>
            <el-card>
              <el-skeleton :rows="5" animated />
            </el-card>
          </template>
        </Responsive>
        <Responsive :col-count="2">
          <template v-slot:col-1>
            <el-card>
              <el-skeleton :rows="5" animated />
            </el-card>
          </template>
          <template v-slot:col-2>
            <el-card>
              <el-skeleton :rows="5" animated />
            </el-card>
          </template>
        </Responsive>
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
import Responsive from "@/components/views/Responsive.vue";
</script>

<style scoped lang="scss"></style>
