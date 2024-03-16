<template>
  <div>
    <el-dialog v-model="visible" :close-on-click-modal="false" :before-close="close">
      <template #header>
        <div class="dialog-title">{{ title ?? "上传文件" }}</div>
        <div class="dialog-desc" v-if="desc">{{ desc }}</div>
      </template>
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
                <div class="imageBox" v-media-match="{ url: file.remoteURL, type: 0 }">
                  <div class="deleteIcon" @click="removeImage(file)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </div>
                  <el-image :preview-src-list="[getUrl(file.remoteURL)]" class="placeholder"
                    :src="getUrl(file.remoteURL)" />
                </div>
                <div class="imageBox" v-media-match="{ url: file.remoteURL, type: 1 }">
                  <div class="deleteIcon" @click="removeImage(file)">
                    <el-icon>
                      <Delete />
                    </el-icon>
                  </div>
                  <video controls :src="getUrl(file.remoteURL)">
                    <source :src="getUrl(file.remoteURL)" type="video/mp4" />
                    <source :src="getUrl(file.remoteURL)" type="video/mov" />
                    <source :src="getUrl(file.remoteURL)" type="video/avi" />
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
import { ref, defineModel, watch } from "vue";
import { Plus, Delete } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import type { UploadFile, UploadFiles, UploadRawFile, UploadUserFile } from "element-plus";

type RemoteUploadUserFile = UploadUserFile & {
  remoteURL: string;
}

const props = defineProps<{
  title?: string,
  desc?: string,
  show: boolean,
  url: string,
  downloadUrl: string,
}>();

const emit = defineEmits<{
  close: [];
}>();

const modelValue = defineModel({ type: Array<string>, default: () => [] });

const visible = ref(props.show);
const accept = ref(".jpg, .jpeg, .gif, .png, .webp, .webm, .mkv, .avi, .mpeg, .mp4, .flv");
const fileList = ref<RemoteUploadUserFile[]>([]);

watch(() => modelValue.value, (urls) => {
  if (!urls) {
    fileList.value = [];
    return;
  }
  fileList.value = urls.map((url: string) => ({
    url: undefined,
    remoteURL: url,
    name: url,
  })) as RemoteUploadUserFile[];
}, { immediate: true });


watch(() => props.show, (val) => {
  visible.value = val;
});

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

};

const removeImage = (file: UploadRawFile) => {
  fileList.value = fileList.value.filter(item => item.name !== file.name);
};

const submit = () => {
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
