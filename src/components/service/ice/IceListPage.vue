<template>
  <div>
    <ListPage
      :page="icePageConfig"
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
          v-if="usePermission().test(icePageConfig.perms.add)"
          >推送</el-button
        >
      </template>
      <template #needRePushColumn="{ row }">
        <el-tag effect="light" :type="row.needRePush ? 'success' : 'danger'">{{
          row.needRePush ? "可用" : "不可用"
        }}</el-tag>
      </template>
      <template #operation="{ row }">
        <div style="display: flex">
          <el-button
            :icon="MoreFilled"
            @click="onLoadJobDetail(row)"
            v-if="usePermission().test(icePageConfig.perms.detail)"
          ></el-button>
          <el-button
            :icon="TopRight"
            :color="varColor.dangerColor"
            @click="onRePushJob(row)"
            :disabled="!row.rePush"
            v-if="usePermission().test(icePageConfig.perms.update)"
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
import { Plus, MoreFilled, TopRight } from "@element-plus/icons-vue";
import { Model } from "@/components/views/data-dialog";
import { SearchParams } from "@/components/views/list-page";
import ListPage from "@/components/views/ListPage.vue";
import { iceListPage, initPageData } from "./config/ice-list-page";
import { icePushDataDialog, Job } from "./config/ice-data-dialog";
import { JobInspectInfo, useIceStore } from "./store/iceStore";
import { useDashboardStore } from "@/components/home/store/dashboardStore";
import { ElMessage, ElMessageBox } from "element-plus";
import DataDialog from "@/components/views/DataDialog.vue";
import usePermission from "@/components/login/hooks/usePermission";

let tableDataRef: Ref<Model[]>;
let reqParams: SearchParams;

const showPushDialog = ref(false);
const pushDialogConfig = ref(icePushDataDialog);
const icePageConfig = ref(iceListPage);

const iceStore = useIceStore();
const dashboardStore = useDashboardStore();

// 加载主题
if (dashboardStore.jobStatInfo.topics) {
  const topicKeys = Object.keys(dashboardStore.jobStatInfo.topics);
  initPageData(icePageConfig, topicKeys);
} else {
  dashboardStore.fetchJobStatInfo().then(() => {
    const topicKeys = Object.keys(dashboardStore.jobStatInfo.topics);
    initPageData(icePageConfig, topicKeys);
  });
}

function onSearch(searchParams: SearchParams, tableData: Ref<Model[]>) {
  reqParams = searchParams;
  tableDataRef = tableData;

  const modelReqParams = searchParams as SearchParams & JobInspectInfo;
  iceStore
    .fetchPage({
      pageStart: searchParams.searchIndex,
      pageSize: searchParams.searchPageSize,
      order: searchParams.order ?? -1,
      entity: {
        id: modelReqParams.id,
        // 使用redis存储方法，必须提供：id + topic
        topic:
          modelReqParams.topic ??
          iceStore.jobInfoList
            .filter((job) => job.id === modelReqParams.id)
            .at(0)?.topic,
      },
    })
    .then((respData) => {
      if (!respData.isSuccess) {
        ElMessage.error(respData.message);
      }
      tableData.value = iceStore.jobInfoList;
    });
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
    pushDialogConfig.value.desc = "当前为只读数据，不能编辑！";
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

<style scoped></style>
