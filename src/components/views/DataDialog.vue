<template>
  <el-dialog
    v-model="showDialog"
    :close-on-click-modal="false"
    :before-close="onClose"
  >
    <template #header>
      <div class="dialog-title">{{ config.title }}</div>
      <div class="dialog-desc" v-if="config.desc">{{ config.desc }}</div>
    </template>
    <el-form :model="model" :rules="config.rules" ref="formRef">
      <div v-for="item in config.board" :key="item.fieldName">
        <el-form-item
          :label="item.label"
          :prop="item.fieldName"
          label-width="140px">
          <el-input
            :type="item.multiple ? 'textarea' : 'text'"
            v-model="model[item.fieldName]"
            :show-password="item.isPassword"
            :disabled="item.isDisable || config.type == 'readonly'"
            autocomplete="off"
            clearable
            v-if="
              (!item.type || item.type == 'text') &&
              (item.displayTest
                ? item.displayTest(
                    model.id === undefined
                      ? OperationType.ADD
                      : OperationType.UPDATE,
                    model
                  )
                : true)"
            style="width: 79%"
          />
          <el-input-number
            v-model="model[item.fieldName]"
            :controls-position="item.numberUsedMill ? 'right' : ''"
            :min="item.numberMin ?? 0"
            :disabled="item.isDisable || config.type == 'readonly'"
            v-else-if="item.type == 'number'"
          />
          <el-select
            :multiple="item.multiple"
            v-model="model[item.fieldName]"
            placeholder="请选择"
            filterable
            :disabled="item.isDisable || config.type == 'readonly'"
            v-else-if="item.type == 'select'"
          >
            <el-option
              v-for="opt in item.selectOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-cascader
            :options="item.selectOptions"
            v-model="model[item.fieldName]"
            v-bind="item.customProps"
            :props="getCascaderProps(item)"
            clearable
            v-else-if="item.type == 'cascaded'"
          />
          <el-upload
            class="image-uploader"
            :action="item.uploadSettings!.uploadURL"
            :show-file-list="false"
            :on-success="item.uploadSettings!.handleSuccess.bind({item, model: ref(model)})"
            :before-upload="item.uploadSettings!.beforeUpload"
            v-else-if="item.type == 'imageUpload'">
            <img v-if="item.uploadSettings!.imageURL" :src="item.uploadSettings!.imageURL" class="placeholder" />
            <img v-else-if="model[item.fieldName]" :src="item.uploadSettings!.loadURL + model[item.fieldName]" class="placeholder" />
            <div v-else class="uploader-icon">
              <el-icon><Plus /></el-icon>
            </div>
          </el-upload>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose(()=>{})">取消</el-button>
        <el-button
          type="primary"
          @click="doConform"
          v-if="config.type !== 'readonly'">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, FormInstance } from "element-plus";
import { Board, DialogConfig, Model, OperationType } from "./data-dialog";
import request from "@/http/uniformRequest";
import { ContentType } from "@/plugins/request";
import { isFunction } from "lodash";

const props = defineProps<{
  visible: boolean;
  config: DialogConfig<Model>;
}>();

const emit = defineEmits<{
  (e: "close", conform: boolean): void;
}>();

let origModel = {...props.config.model};

// 组件在哪里修改，就在哪里定义Ref
const showDialog = ref(props.visible);
const model = ref<Model>(props.config.model);
const formRef = ref<FormInstance>();

// 监听父组件的修改来双向修改
watch(
  () => props.visible,
  (isVisible) => (showDialog.value = isVisible)
);
// 监听父组件提供的初始化数据
watch(
  () => props.config.model,
  (newModel) => {
    model.value = newModel;
    origModel = {...newModel};
  });

function getCascaderProps(item: Board) {
  if (item.multiple) {
    return { multiple: true };
  }
  // 单选时，不关联父节点
  return {
    checkStrictly: true,
  };
}

function onClose(command: () => void) {
  hide(false);
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

    // 参数格式化
    const opsType = model.value.id === undefined ? OperationType.ADD : OperationType.UPDATE;
    props.config.board.forEach((item) => {
      if (opsType === OperationType.UPDATE) {
        if (model.value[item.fieldName] === origModel[item.fieldName]) {
          model.value[item.fieldName] = undefined;
        }
      }
      item.format && (model.value[item.fieldName] = item.format(
        model.value[item.fieldName],
        opsType,
        model
      ));
    });

    request({
      url: props.config.request.url,
      method: props.config.request.method,
      params: model.value,
      contentType: props.config.request.type ?? ContentType.JSON,
      showLoading: true,
    }).then((respData) => {
      let hasFinish = false;
      if (respData.isSuccess) {
        hasFinish = true;
      } else {
        ElMessage.error(respData.message);
      }
      hide(hasFinish);
    });
  });
}

// 隐藏对话框
function hide(finish: boolean) {
  formRef.value?.clearValidate();
  showDialog.value = false;
  emit("close", finish);
}
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
  font-size: small;
  color: #ccc;
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

.image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  .uploader-icon {
    font-size: 32px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .placeholder {
    width: 80px;
    height: 80px;
    object-fit: contain;
    display: block;
  }
}
.image-uploader:hover {
  border-color: #409eff;
}
</style>
