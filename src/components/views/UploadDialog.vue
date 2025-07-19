<template>
  <div>
    <PopDialog :title :desc :show :width @close="close" @submit="submit">
      <template #content>
        <el-form ref="formRef">
          <el-form-item label="选择图片与视频">
            <el-upload v-model:file-list="fileList" :on-exceed="exceed" :limit="10" :accept="accept" :action="url"
              show-file-list multiple :on-success="handleSuccess" :before-upload="beforeUpload" list-type="picture-card"
              class="image-uploader">
              <el-icon>
                <Plus />
              </el-icon>
              <template #file="{ file }">
                <template v-if="!file.url">
                  <!-- 远程地址 -->
                  <div class="imageBox" v-media-match="{ url: (file as RemoteUploadUserFile).remoteURL, type: 0 }">
                    <div class="deleteIcon" @click="removeImage(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </div>
                    <el-image :preview-src-list="[getUrl((file as RemoteUploadUserFile).remoteURL)]" class="placeholder"
                      :src="getUrl((file as RemoteUploadUserFile).remoteURL)" />
                  </div>
                  <div class="imageBox" v-media-match="{ url: (file as RemoteUploadUserFile).remoteURL, type: 1 }">
                    <div class="deleteIcon" @click="removeImage(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </div>
                    <video controls :src="getUrl((file as RemoteUploadUserFile).remoteURL)">
                      <source :src="getUrl((file as RemoteUploadUserFile).remoteURL)" type="video/mp4" />
                      <source :src="getUrl((file as RemoteUploadUserFile).remoteURL)" type="video/mov" />
                      <source :src="getUrl((file as RemoteUploadUserFile).remoteURL)" type="video/avi" />
                    </video>
                  </div>
                </template>
                <template v-else>
                  <!-- 本地地址 -->
                  <div class="imageBox" v-media-match="{ url: file.name, type: 0 }">
                    <div class="deleteIcon" @click="removeImage(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </div>
                    <el-image :preview-src-list="[file.url]" class="placeholder" :src="file.url" />
                  </div>
                  <div class="imageBox" v-media-match="{ url: file.name, type: 1 }">
                    <div class="deleteIcon" @click="removeImage(file)">
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </div>
                    <video controls :src="file.url">
                      <source :src="file.url" type="video/mp4" />
                      <source :src="file.url" type="video/mov" />
                      <source :src="file.url" type="video/avi" />
                    </video>
                  </div>
                </template>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </template>
    </PopDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineModel, watch } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { UploadFile, UploadFiles, UploadRawFile, UploadUserFile } from "element-plus";
import PopDialog from "./PopDialog.vue";
import { DialogSettings } from "./data-dialog";

type RemoteUploadUserFile = UploadUserFile & {
  remoteURL: string;
}

const props = defineProps<DialogSettings & {
  url: string,
  downloadUrl: string,
}>();

const emit = defineEmits<{
  close: [];
}>();

const modelValue = defineModel({ type: Array<string>, default: () => [] });

const accept = ref(".jpg, .jpeg, .gif, .png, .webp, .webm, .mkv, .avi, .mpeg, .mp4, .flv");
const fileList = ref<RemoteUploadUserFile[]>([]);

watch(() => modelValue.value, (urls) => {
  if (!urls) {
    fileList.value = [];
    return;
  }
  fileList.value = urls.map((url: string) => (<RemoteUploadUserFile>{
    url: undefined,
    remoteURL: url,
    name: url,
  }));
}, { immediate: true });


const getUrl = (filename: string) => {
  return props.downloadUrl + filename;
};

const exceed = () => {
  ElMessage.warning("只能上传10张图片或视频！");
};



function beforeUpload(file: UploadRawFile) {
  const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
  // 图片判断
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    const isLimitPic = file.size / 1024 / 1024 < 2;
    if (!isLimitPic) {
      ElMessage.warning("上传图片大小不能超过 2MB!");
    }
    return isLimitPic;

    // 视频判断
  } else if (["avi", "mkv", "mpeg", "mp4", "m4v", "flv", "webm"].includes(ext)) {
    const isLimitPic = file.size / 1024 / 1024 < 20;
    if (!isLimitPic) {
      ElMessage.warning("上传视频大小不能超过 20MB!");
    }
    return isLimitPic;
  }
}

const handleSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (response.code == -1) {
    ElMessage.warning(response.message ? response.message : "上传失败！");
    fileList.value = [];
    return;
  }

};

const removeImage = (file: UploadFile) => {
  fileList.value = fileList.value.filter(item => item.name !== file.name);
};

const submit = () => {
  if (fileList.value[0]) {
    const ext = fileList.value[0].name.substring(fileList.value[0].name.lastIndexOf(".") + 1);
    if (["avi", "mkv", "mpeg", "mp4", "m4v", "flv", "webm"].includes(ext)) {
      fileList.value = [];
      return ElMessage.warning("上传的第一个文件必须为图片，请重新上传！");
    }
  }
  let list = fileList.value.map((item: any) => {
    // 如果远程地址存在，使用远程地址
    if (item.remoteURL) {
      return item.remoteURL;
    } else if (item.response.data.filePath) {
      // 本地使用服务器返回的地址
      return item.response.data.filePath;
    }
  });
  modelValue.value = list;
};

const close = () => {
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

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  text-align: center;
  border: 1px dashed #dcdfe6;
}

.placeholder {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.imageBox {
  position: relative;

  video {
    width: 145px;
    height: 145px;
    object-fit: contain;
  }

  .deleteIcon {
    position: absolute;
    top: 2px;
    right: 1px;
    width: 35px;
    height: 35px;
    z-index: 3;
    background-color: rgb(210 207 207 / 74%);
    color: #7c7c7c;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    .el-icon {
      font-weight: bold;
      font-size: 18px;
    }

  }
}
</style>
