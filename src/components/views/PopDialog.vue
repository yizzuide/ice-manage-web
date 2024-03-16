<template>
  <div>
    <el-dialog v-model="visible" :close-on-click-modal="false" :before-close="close"
    :width="width ?? 600">
      <template #header>
        <div class="dialog-title">{{ title }}</div>
        <div class="dialog-desc" v-if="desc">{{ desc }}</div>
      </template>
      <slot name="content"></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import { DialogSettings } from "./data-dialog";


const props = defineProps<DialogSettings>();

const emit = defineEmits<{
  close: [];
  submit: [];
}>();

const visible = ref(props.show);

watch(() => props.show, (val) => {
  visible.value = val;
});


const submit = () => {
  emit("submit");
  close();
};

const close = () => {
  visible.value = false;
  emit("close");
};

</script>

<style scoped lang="scss">
.dialog-title {
  text-align: center;
  font-weight: bold;
  color: $primaryColor;
}

.dialog-desc {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: red;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
