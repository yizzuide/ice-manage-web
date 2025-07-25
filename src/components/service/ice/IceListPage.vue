<template>
  <div>
    <ListPage
      :page="icePageConfig"
      :pageCount="iceStore.pageCount"
      :total="iceStore.totalSize"
      @search="pageProxyHandler.onSearch"
    >
      <template #command>
        <el-button
          :icon="Plus"
          :color="varColor.successColor"
          style="color: white"
          @click="onPush"
          v-permission="icePageConfig.perms.add"
          >推送</el-button>
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
            v-permission="icePageConfig.perms.detail"
          ></el-button>
          <el-button
            :icon="TopRight"
            :color="varColor.dangerColor"
            @click="onRePushJob(row)"
            :disabled="!row.rePush"
            v-permission="icePageConfig.perms.update"
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
import { useDashboardStore } from "@/components/home/store/dashboardStore";
import DataDialog from "@/components/views/DataDialog.vue";
import ListPage from "@/components/views/ListPage.vue";
import { usePageProxyHandler } from "@/components/views/pageProxyHandler";
import varColor from "@/styles/define.module.scss";
import { MoreFilled, Plus, TopRight } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { Job, icePushDataDialog } from "./config/ice-data-dialog";
import { iceListPage, initPageData } from "./config/ice-list-page";
import { JobInspectInfo, useIceStore } from "./store/iceStore";


const showPushDialog = ref(false);
const pushDialogConfig = ref(icePushDataDialog);
const icePageConfig = ref(iceListPage);

const iceStore = useIceStore();
const dashboardStore = useDashboardStore();

const pageProxyHandler = usePageProxyHandler<JobInspectInfo>({
  init() {
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
  },
  onSearch(searchParams, tableData) {
    iceStore
      .fetchPage({
        pageStart: searchParams.searchIndex,
        pageSize: searchParams.searchPageSize,
        order: (searchParams as TypeModel<JobInspectInfo>).order ?? -1,
        entity: {
          id: searchParams.id,
          // 使用redis存储方法，必须提供：id + topic
          topic:
            searchParams.topic ??
            iceStore.jobInfoList
              .filter((job) => job.id === searchParams.id)
              .at(0)?.topic,
        },
      })
      .then((respData) => {
        tableData.value = iceStore.jobInfoList;
      });
  },
});

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
    pageProxyHandler.refresh();
  }
}

function onLoadJobDetail(row: JobInspectInfo) {
  if (row.queueType == "NoneQueue") {
    ElMessage.warning("当前Job已完成，在JobPool中不存在！");
    return;
  }
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
