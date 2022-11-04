<template>
  <div>
    <el-card>
      <div class="search-row">
        <div class="search-item">
          <el-input
            :placeholder="page.struct.search.firstInput.placeholder"
            :prefix-icon="Search"
            v-model="searchName"
            :formatter="(value: string) => value.replace(/\s/g, '')"
            clearable
          ></el-input>
        </div>
        <div class="search-item">
          <el-date-picker
            v-model="searchDate"
            type="daterange"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-value="[dayjs().subtract(1, 'month'), dayjs()]"
          />
        </div>
        <div class="search-item">
          <el-button :icon="Search" @click="search">搜索</el-button>
        </div>
      </div>
      <el-row v-if="isNormalPageType">
        <el-button
          :icon="Plus"
          color="#52C37D"
          style="color: white"
          @click="addRow"
          >新增</el-button
        >
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        max-height="250"
        row-key="id"
        default-expand-all
        highlight-current-row
        @current-change="changeSelectedRow"
      >
        <template v-for="item in page.struct.table.items" :key="item.prop">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width ?? 120"
            :formatter="item.format"
          />
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
          v-if="!page.struct.table.hiddenOperationColumn"
        >
          <template #default="scope">
            <div style="display: flex" v-if="isNormalPageType">
              <el-button
                :icon="Edit"
                color="#FBEC45"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                :icon="Delete"
                color="#E92D46"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </div>
            <!-- type="readonly" -->
            <slot name="operation" :row="scope.row" v-else></slot>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :page-count="pageCount"
        :current-page="pageIndex"
        @current-change="changePageIndex"
      />
    </el-card>
    <DataDialog
      :visible="showDialog"
      :config="dialogConfig!"
      @close="onDialogClose"
      v-if="isNormalPageType"
    ></DataDialog>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { Search, Plus, Edit, Delete } from "@element-plus/icons-vue";
import DataDialog from "./DataDialog.vue";
import { ElMessageBox } from "element-plus";
import { OperationNamed, Page, SearchParams } from "./list-page";
import dayjs from "dayjs";
import { DialogConfig, Model } from "./data-dialog";

const props = defineProps<{
  page: Page<any>;
  pageSize: number;
  pageCount: number;
  total: number;
}>();
const emit = defineEmits<{
  (e: "search", params: SearchParams, tableData: Ref<Model[]>): void;
  (
    e: "operation",
    name: OperationNamed,
    selectedRow: Model,
    dialogConfig: Ref<DialogConfig<Model>>
  ): void;
}>();

const searchName = ref("");
const searchDate = ref<Date[]>();
const tableData = ref(<Model[]>[]);
let selectedRow: Model;

const isNormalPageType = !props.page.type || props.page.type == "normal";
const dialogConfig = ref(props.page.struct.dialogConfig);
const showDialog = ref(false);
const pageIndex = ref<number>(1);

search();

function search() {
  emit(
    "search",
    {
      searchIndex: pageIndex.value,
      searchName: searchName.value,
      searchDate: searchDate.value,
    },
    tableData
  );
}

function changePageIndex(index: number) {
  pageIndex.value = index;
  search();
}

const addRow = () => {
  emit(
    "operation",
    "add",
    selectedRow,
    dialogConfig as Ref<DialogConfig<Model>>
  );
  showDialog.value = true;
};

const changeSelectedRow = (row: Model) => {
  selectedRow = row;
};

const handleEdit = (index: number, row: Model) => {
  emit("operation", "edit", row, dialogConfig as Ref<DialogConfig<Model>>);
  showDialog.value = true;
};

const handleDelete = (index: number, row: Model) => {
  ElMessageBox.confirm("确定删除吗？", "警告").then(() => {
    emit("operation", "remove", row, dialogConfig as Ref<DialogConfig<Model>>);
  });
};

function onDialogClose(conform: boolean) {
  showDialog.value = false;
  conform && search();
}
</script>

<style scoped lang="scss">
.search-row {
  display: flex;
  flex-wrap: wrap;

  .search-item {
    margin-right: 15px;
    margin-bottom: 15px;
  }
}
.el-pagination {
  display: flex;
  margin-top: 15px;
  justify-content: center;
}
</style>