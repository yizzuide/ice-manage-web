<template>
  <el-dialog
    v-model="showDialog"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="onClose"
  >
    <template #header>
      <span class="dialog-title">{{ config.title }}</span>
    </template>
    <el-form :model="data" :rules="config.rules" ref="formRef">
      <div v-for="item in config.board" :key="item.fieldName">
        <el-form-item
          :label="item.label"
          :prop="item.fieldName"
          label-width="140px"
        >
          <el-input
            v-model="data[item.fieldName]"
            :show-password="item.isPassword"
            :disabled="item.isDisable"
            autocomplete="off"
            v-if="item.type === undefined || item.type == 'text'"
          />
          <el-input-number
            v-model="data[item.fieldName]"
            :min="0"
            :max="10"
            v-else-if="item.type == 'number'"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="doConform"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { isFunction } from "@vueuse/shared";
import { ElMessage, FormInstance } from "element-plus";
import { DialogConfig } from "../types/dialog";
import request from "@/http/uniformRequest";

const props = defineProps<{
  visible: boolean;
  config: DialogConfig;
}>();

const emit = defineEmits<{
  (e: "close", conform: boolean): void;
}>();

const data = ref(props.config.model);
const showDialog = ref(props.visible);
const formRef = ref<FormInstance>();

// 监听父组件的props修改
watch(
  () => props.visible,
  (isVisible) => (showDialog.value = isVisible)
);

function onClose(command: () => void) {
  emit("close", false);
  if (isFunction(command)) {
    command();
  }
}

function doConform() {
  formRef.value?.validate((valid, fields) => {
    if (!valid) {
      ElMessage.error("输入格式不正确！");
      return false;
    }

    request({
      url: props.config.request.url,
      method: props.config.request.method,
      params: data.value,
      showLoading: true,
    }).then((_) => {
      showDialog.value = false;
      emit("close", true);
    });
  });
}
</script>

<style scoped>
.dialog-title {
  display: block;
  text-align: center;
  font-weight: bold;
}
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
