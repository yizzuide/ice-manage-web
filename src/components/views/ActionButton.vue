<template>
  <div>
    <el-button type="primary" @click="visible = true">{{ config.actionBtnName }}</el-button>
    <UploadDialog v-model="modelValue" :show="visible" :title="config.dialogTitle" :url="config.url"
      :download-url="config.downloadUrl" @close="() => visible = false">
    </UploadDialog>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, defineModel } from "vue";
import { ActionSettings } from "./data-dialog";
import UploadDialog from "./UploadDialog.vue";

defineProps<{
  config: ActionSettings
}>();

const modelValue = defineModel({ type: Array<T> });
const visible = ref(false);

</script>

<style scoped></style>
