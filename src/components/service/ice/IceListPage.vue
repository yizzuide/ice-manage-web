<template>
  <div>
    <ListPage
      :page="iceListPage"
      :page-size="10"
      :page-count="iceStore.pageCount"
      :total="iceStore.totalSize"
      @search="onSearch"
    >
      <template #search>
        <div class="search-item">
          <el-input
            placeholder="输入job的id"
            :prefix-icon="Search"
            v-model="searchName"
            :formatter="(value: string) => value.replace(/\s/g, '')"
            clearable
          ></el-input>
        </div>
      </template>
      <template #command>
        <el-button
          :icon="Plus"
          color="#52C37D"
          style="color: white"
          @click="onPush"
          >推送</el-button
        >
      </template>
      <template #operation="{ row }">
        <div style="display: flex">
          <el-button :icon="MoreFilled" @click="onLoadDetail(row)"></el-button>
          <el-button
            :icon="TopRight"
            color="#E92D46"
            @click="onRePush(row)"
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
import { Plus, Search, MoreFilled, TopRight } from "@element-plus/icons-vue";
import { DialogConfig, Model } from "@/components/views/data-dialog";
import { SearchParams } from "@/components/views/list-page";
import ListPage from "@/components/views/ListPage.vue";
import { iceListPage } from "./config/ice-list-page";
import { icePushDataDialog, Job } from "./config/ice-data-dialog";
import { JobInspectInfo, useIceStore } from "./store/iceStore";
import { ElMessageBox } from "element-plus";
import DataDialog from "@/components/views/DataDialog.vue";

const searchName = ref("");
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
  pushDialogConfig.value.request.url = "/api/job/push";
  pushDialogConfig.value.model = <Job>{
    delay: 10000,
    ttr: 30000,
    retryCount: 3,
  };
  showPushDialog.value = true;
}

function onPushDialogClose(finish: boolean) {
  if (finish) {
    onSearch(reqParams, tableDataRef);
  } else {
    showPushDialog.value = !showPushDialog.value;
  }
}

function onLoadDetail(row: JobInspectInfo) {}

function onRePush(row: JobInspectInfo) {
  ElMessageBox.confirm("确定要重推Job吗？", "警告").then(() => {});
}
</script>

<style scoped>
.search-item {
  margin-right: 15px;
  margin-bottom: 15px;
}
</style>
