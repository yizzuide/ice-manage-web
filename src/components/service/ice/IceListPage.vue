<template>
  <div>
    <ListPage
      :page="iceListPage"
      :page-size="10"
      :page-count="iceStore.pageCount"
      :total="iceStore.totalSize"
      @search="onSearch"
    >
      <template #command>
        <el-button
          :icon="Plus"
          :color="varColor.successColor"
          style="color: white"
          @click="onPush"
          >推送</el-button
        >
      </template>
      <template #operation="{ row }">
        <div style="display: flex">
          <el-button
            :icon="MoreFilled"
            @click="onLoadJobDetail(row)"
          ></el-button>
          <el-button
            :icon="TopRight"
            :color="varColor.dangerColor"
            @click="onRePushJob(row)"
            :disabled="!row.rePush"
          ></el-button>
        </div>
      </template>
    </ListPage>
    <DataDialog
      :visible="showPushDialog"
      :config="pushDialogConfig"
      @close="onPushDialogClose"
    ></DataDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import varColor from "@/styles/define.module.scss";
import { Plus, Search, MoreFilled, TopRight } from "@element-plus/icons-vue";
import { Model } from "@/components/views/data-dialog";
import { SearchParams } from "@/components/views/list-page";
import ListPage from "@/components/views/ListPage.vue";
import { iceListPage } from "./config/ice-list-page";
import { icePushDataDialog, Job } from "./config/ice-data-dialog";
import { JobInspectInfo, useIceStore } from "./store/iceStore";
import { ElMessage, ElMessageBox } from "element-plus";
import DataDialog from "@/components/views/DataDialog.vue";

const iceStore = useIceStore();
let tableDataRef: Ref<Model[]>;
let reqParams: SearchParams;

const showPushDialog = ref(false);
const pushDialogConfig = ref(icePushDataDialog);

function onSearch(params: SearchParams, tableData: Ref<Model[]>) {
  reqParams = params;
  tableDataRef = tableData;
  iceStore
    .fetchPage({
      pageStart: params.searchIndex,
      pageSize: 10,
      order: -1,
    })
    .then(() => (tableData.value = iceStore.jobInfoList));
}

function onPush() {
  pushDialogConfig.value.type = "normal";
  pushDialogConfig.value.title = "推送延迟任务";
  pushDialogConfig.value.desc =
    "该功能仅用于测试环境，正式环境请在后台使用Ice API！";
  pushDialogConfig.value.model = <Job>{
    delay: 10000,
    ttr: 30000,
    retryCount: 3,
  };
  showPushDialog.value = true;
}

function onPushDialogClose(finish: boolean) {
  showPushDialog.value = false;
  if (finish) {
    onSearch(reqParams, tableDataRef);
  }
}

function onLoadJobDetail(row: JobInspectInfo) {
  iceStore.fetchJobDetail(row.id, row.topic).then((respData) => {
    pushDialogConfig.value.type = "readonly";
    pushDialogConfig.value.title = "Job推送详细";
    pushDialogConfig.value.desc = "当前数据仅能查看，不能编辑！";
    const jobDetail = respData.data!;
    // json -> string
    if (typeof jobDetail.body === "object") {
      jobDetail.body = JSON.stringify(jobDetail.body);
    }
    pushDialogConfig.value.model = respData.data!;
    showPushDialog.value = true;
  });
}

function onRePushJob(row: JobInspectInfo) {
  ElMessageBox.confirm("确定要重推Job吗？", "警告").then(() => {
    iceStore.rePushJob(row.id, row.topic).then((respData) => {
      if (respData.isSuccess) {
        ElMessage.info("重新推送成功！");
      } else {
        ElMessage.warning(respData.message);
      }
    });
  });
}
</script>

<style scoped>
.search-item {
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>
