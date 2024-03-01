<template>
  <div>
    <el-button type="primary" @click="visible = true">{{ config.actionBtnName }}</el-button>
    <UploadDialog
      v-model="modelValue"
      :show="visible"
      :title="config.dialogTitle"
      :url="config.url"
      :download-url="config.downloadUrl"
      @close="() => visible = false">
    </UploadDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineModel } from "vue";
import { ActionSettings } from "./data-dialog";
import UploadDialog from "./UploadDialog.vue";

defineProps<{
  config: ActionSettings
}>();

const modelValue = defineModel({default: () => []});
const visible = ref(false);

</script>

<style scoped></style>
