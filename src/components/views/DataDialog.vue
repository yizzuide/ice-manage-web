<template>
  <el-dialog v-model="showDialog" :close-on-click-modal="false" :before-close="onClose"
    :width="config.width ? config.width : '600px'">
    <template #header>
      <div class="dialog-title">{{ config.title }}</div>
      <div class="dialog-desc" v-if="config.desc">{{ config.desc }}</div>
    </template>
    <el-form :model="model" :rules="config.rules" ref="formRef">
      <div v-for="item in config.board" :key="item.fieldName" :style="dialogItemStyle(item)">
        <el-form-item :label="item.label" :prop="item.fieldName"
          :label-width="item.layoutInline ? (item.layoutInlineStart ? '200px' : '0px') : '200px'">
          <div v-if="item.type === 'label'"></div>
          <el-input :type="item.multiple ? 'textarea' : 'text'" v-model="model[item.fieldName]"
            :show-password="item.isPassword"
            :disabled="item.isDisable || (item.disableTest && item.disableTest(getOpsType(), model as T)) || config.type == 'readonly'"
            :autosize="item.multiple && { minRows: 3 }" autocomplete="off" clearable style="width: 300px" v-else-if="(!item.type || item.type == 'text') &&
              (item.displayTest
                ? item.displayTest(getOpsType(), model as T) : true)" />
          <el-input-number v-model="model[item.fieldName]" v-bind="item.customProps"
            :controls-position="item.numberUsedMill ? 'right' : ''" :min="item.numberMin ?? 0"
            :max="item.numberMax ?? Infinity"
            :disabled="item.isDisable || (item.disableTest && item.disableTest(getOpsType(), model as T)) || config.type == 'readonly'"
            v-else-if="item.type == 'number'" @change="inputChange($event, item)" />
          <el-select v-else-if="item.type == 'select'" :multiple="item.multiple" v-model="model[item.fieldName]"
            placeholder="请选择" :filterable="item.selectFilterable" @change="item.selectChange"
            :disabled="item.isDisable || (item.disableTest && item.disableTest(getOpsType(), model as T)) || config.type == 'readonly'">
            <el-option v-for="opt in item.selectOptions" :key="opt.value" :label="opt.label" :value="opt.value"
              :disabled="opt.displayTest ? !opt.displayTest(getOpsType(), model as T) : false" />
          </el-select>
          <el-checkbox v-model="model[item.fieldName]" v-bind="item.customProps"
            :disabled="item.isDisable || (item.disableTest && item.disableTest(getOpsType(), model as T)) || config.type == 'readonly'"
            v-else-if="item.type == 'checkbox'">
            {{ "" }}
          </el-checkbox>
          <el-cascader :options="item.selectOptions" v-model="model[item.fieldName]" v-bind="item.customProps"
            :props="getCascaderProps(item)"
            :disabled="item.isDisable || (item.disableTest && item.disableTest(getOpsType(), model as T)) || config.type == 'readonly'"
            clearable v-else-if="item.type == 'cascaded'" style="width: 300px"
            :separator="item.cascadedSeparator ? item.cascadedSeparator : '/'" @change="item.selectChange" />
          <el-color-picker v-model="model[item.fieldName]" v-else-if="item.type == 'colorPicker'" />
          <el-date-picker v-model="model[item.fieldName]" type="date" placeholder="选择日期" format="YYYY 年 MM 月 DD 日"
            :default-value="dayjs().toDate()" :value-format="item.dateValueFormat" v-else-if="item.type == 'datePicker'">
          </el-date-picker>
          <el-time-select v-model="model[item.fieldName]" placeholder="选择时间" start="00:00" end="23:59"
            :step="item.timeStep ?? '00:01'" v-else-if="item.type == 'timeSelect'">
          </el-time-select>
          <JsonEditor v-model:text="model[item.fieldName]" mode="text" lang="zh_CN" queryLanguageId="javascript"
            :askToFormat="false" style="width: 100%" v-else-if="item.type == 'jsonEditor'">
          </JsonEditor>
          <el-upload v-else-if="item.type == 'imageUpload' || item.type == 'videoUpload' || item.type == 'audioUpload'"
            class="image-uploader" :action="item.uploadSettings!.uploadURL" :show-file-list="false"
            :on-success="item.uploadSettings!.handleSuccess.bind({ item, model: ref(model) })"
            :on-progress="item.uploadSettings!.handleProcess" :before-upload="item.uploadSettings!.beforeUpload">
            <div v-if="item.type === 'imageUpload'">
              <img v-if="item.uploadSettings!.imageURL" :src="item.uploadSettings!.imageURL" class="placeholder" />
              <img v-else-if="model[item.fieldName]" :src="item.uploadSettings!.loadURL + model[item.fieldName]"
                class="placeholder" />
              <div v-else class="uploader-icon">
                <el-icon>
                  <Plus />
                </el-icon>
              </div>
            </div>
            <div v-else-if="item.type === 'audioUpload'">
              <audio v-if="item.uploadSettings!.imageURL" :src="item.uploadSettings!.imageURL" class="audio-style"
                controls>
              </audio>
              <audio v-else-if="model[item.fieldName]" :src="item.uploadSettings!.loadURL + model[item.fieldName]"
                class="audio-style" controls>
              </audio>
              <div v-else class="uploader-icon">
                <el-icon>
                  <Plus />
                </el-icon>
              </div>
            </div>
            <div v-else-if="item.type === 'videoUpload'">
              <video v-if="item.uploadSettings!.imageURL" :src="item.uploadSettings!.imageURL" class="video-style"
                controls>
              </video>
              <video v-else-if="model[item.fieldName]" :src="item.uploadSettings!.loadURL + model[item.fieldName]"
                class="video-style" controls>
              </video>
              <div v-else class="uploader-icon">
                <el-icon>
                  <Plus />
                </el-icon>
              </div>
            </div>
          </el-upload>
          <el-radio-group v-model="model[item.fieldName]" :disabled="item.isDisable" v-else-if="item.type == 'radio'">
            <el-radio :label="opt.value" v-for="opt in item.selectOptions" v-bind:key="opt.value">
            {{ opt.label}}
            </el-radio>
          </el-radio-group>
          <div v-else-if="item.type == 'actionButton'">
            <ActionButton v-model="model[item.fieldName]" :config="item.actionSettings!" />
          </div>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose(() => { })">取消</el-button>
        <el-button type="primary" @click="doConform" :disabled="conformDisabled" v-if="config.type !== 'readonly'">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" generic="T extends Model">
import useEventBus from "@/hooks/useEventBus";
import request from "@/http/uniformRequest";
import { ContentType } from "@/plugins/request";
import { Plus } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import { isFunction } from "lodash";
import { Ref, UnwrapRef, nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";
import JsonEditor from "vue3-ts-jsoneditor";
import { Board, DialogConfig, LogData, Model, OperationType } from "./data-dialog";
import ActionButton from "./ActionButton.vue";

const route = useRoute();
const eventBus = useEventBus();

const props = defineProps<{
  visible: boolean;
  config: DialogConfig<T>;
}>();

const emit = defineEmits<{
  /**
   * 关闭事件
   * conform: 是否为点击确认发起
   * conformWithError: 确认是否有错误
   */
  close: [conform: boolean, conformWithError: boolean];
}>();

let origModel = { ...props.config.model };

// 组件在哪里修改，就在哪里定义Ref
const showDialog = ref(props.visible);
const model = ref<T>(props.config.model as T);
const formRef = ref<FormInstance>();
const conformDisabled = ref(false);


// 监听父组件的修改来双向修改
watch(
  () => props.visible,
  (isVisible) => (showDialog.value = isVisible)
);
// 监听父组件提供的初始化数据
watch(
  () => props.config.model,
  (newModel) => {
    model.value = newModel as UnwrapRef<T>;
    origModel = { ...newModel };
  });


function dialogItemStyle(item: Board<T>) {
  let style: any = {};
  if (item.layoutInline) {
    style.display = "inline-block";
    style["margin-right"] = `${item.layoutInlineMarginRight ?? 50}px`;
  }
  if (item.layoutHeight) {
    style.height = `${item.layoutHeight}px`;
  }
  return style;
}

function getCascaderProps(item: Board<T>) {
  if (item.multiple) {
    return { multiple: true };
  }

  // 替换Value值为Label
  if (item.cascadedLabelAsValue) {
    return {
      // 单选时，不关联父节点
      checkStrictly: true,
      value: "label",
    };
  }

  return {
    checkStrictly: true,
  };
}

function getOpsType() {
  return model.value.id === undefined ? OperationType.ADD : OperationType.UPDATE;
}

function onClose(command: () => void) {
  hide(false, false);
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

    if (props.config.request.beforeRequest) {
      const isPass = props.config.request.beforeRequest(model.value as T);
      if (!isPass) {
        return false;
      }
    }

    // 参数格式化
    const opsType = model.value.id === undefined ? OperationType.ADD : OperationType.UPDATE;
    const allFieldCount = props.config.board.length;
    let ignoreFieldCount = 0;
    let needUpdate = true;
    let requestData = <T>{};
    if (opsType === OperationType.UPDATE) {
      (requestData as Model).id = model.value.id;
    } else {
      requestData = model.value as T;
    }
    props.config.board.forEach((item) => {
      if (opsType === OperationType.UPDATE) {
        if (model.value[item.fieldName] === origModel[item.fieldName]) {
          ignoreFieldCount++;
          if (ignoreFieldCount === allFieldCount) {
            needUpdate = false;
          }
          return;
        }
        (requestData as Model)[item.fieldName] = model.value[item.fieldName];
      }
      item.format && ((requestData as Model)[item.fieldName] = item.format(
            requestData[item.fieldName],
            opsType,
            model as Ref<T>
          ));
    });
    if (opsType == OperationType.UPDATE && !needUpdate) {
      ElMessageBox.confirm("当前无修改项，不需要更新！");
      hide(false, false);
      return;
    }

    // 请求参数格式化
    if (props.config.request.requestDataFormat) {
      requestData = props.config.request.requestDataFormat(requestData);
    }

    request({
      url: props.config.request.url,
      method: props.config.request.method,
      params: requestData,
      contentType: props.config.request.type ?? ContentType.JSON,
      showLoading: true,
      interceptor: props.config.request.interceptor
    }).then((respData) => {
      let hasError = !respData.isSuccess;
      if (hasError) {
        ElMessage.error(respData.message);
        // 更新出错时，退出对话框
        if (opsType == OperationType.UPDATE) {
          hasError = !hasError;
        }
      } else {
        if (!props.config.request.ignoreEmitLog) {
          //记录add edit操作日志
          const logData = <LogData>{
            recordId: origModel.id ?? (typeof respData.data === "number" ? respData.data : null),
            pageName: route.meta.title,
            type: opsType,
            beforeValue: opsType === OperationType.ADD ? "" : JSON.stringify(origModel),
            afterValue: JSON.stringify(props.config.model)
          };
          eventBus.emit("operationLog", logData);
        }
      }
      hide(true, hasError);
    });
  });
}

// 隐藏对话框
function hide(conform: boolean, conformWithError: boolean) {
  conformDisabled.value = false;
  if (conform) {
    if (!conformWithError) {
      showDialog.value = false;
    }
  } else {
    formRef.value?.clearValidate();
    showDialog.value = false;
  }
  emit("close", conform, conformWithError);
}

function inputChange(value: any, item: Board<T>) {
  if (item.numberFormatInt) {
    nextTick(() => {
      (model.value as Model)[item.fieldName] = parseInt(value);
    });
  }
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
  color: $hintColor;
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

  .video-style {
    width: 200px;
    height: 200px;
    object-fit: contain;
    display: block;
  }

  .audio-style {
    width: 120px;
    height: 65px;
    object-fit: contain;
    display: block;
  }
}

.image-uploader:hover {
  border-color: #409eff;
}
</style>

<!-- css module: class名添加hash后缀，在模板里通过$style.xxx引用，如果有命名(module="名称")，通过：名称.xxx -->
<style lang="scss" module>
.interactRow {
  display: flex;
  flex-wrap: wrap;

  .searchItem {
    margin-right: 15px;
    margin-bottom: 15px;
  }
}
</style>
