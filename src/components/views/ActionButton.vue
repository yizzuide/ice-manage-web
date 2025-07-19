<template>
  <div>
    <el-button type="primary" @click="visible = true">{{ actionBtnName }}</el-button>
    <UploadDialog v-model="modelValue" :show="visible" :title :desc :url :downloadUrl @close="() => visible = false">
    </UploadDialog>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
import { ref, defineModel } from "vue";
import { ActionSettings } from "./data-dialog";
import UploadDialog from "./UploadDialog.vue";

defineProps<ActionSettings>();

const modelValue = defineModel({ type: Array<T> });
const visible = ref(false);

</script>

<style scoped></style>
