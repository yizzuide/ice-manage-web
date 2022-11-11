<template>
  <div>
    <el-card>
      <div :class="$style.interactRow">
        <div
          :class="$style.interactRow"
          v-if="!page.struct.search.custom && page.struct.search.items"
        >
          <div
            :class="$style.searchItem"
            v-for="item in page.struct.search.items"
            :key="item.prop"
          >
            <el-input
              :placeholder="item.placeholder"
              v-model="searchParams[item.prop]"
              :formatter="(value: string) => value.replace(/\s/g, '')"
              clearable
              v-if="item.type == 'text'"
            ></el-input>
            <el-select
              :placeholder="item.placeholder"
              v-model="searchParams[item.prop]"
              v-else-if="item.type == 'select'"
            >
              <el-option
                v-for="opt in item.selectOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            <el-date-picker
              v-model="searchParams[item.prop]"
              type="daterange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-value="[dayjs().subtract(1, 'month'), dayjs()]"
              v-bind="item.inputSettings"
              v-else-if="item.type == 'date'"
            />
          </div>
        </div>
        <div :class="$style.interactRow" v-else>
          <slot name="search"></slot>
        </div>
        <div :class="$style.searchItem">
          <el-button :icon="Search" @click="search">搜索</el-button>
        </div>
        <div :class="$style.searchItem">
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </div>
      </div>
      <div :class="$style.interactRow">
        <el-button
          :icon="Plus"
          :color="varColor.successColor"
          style="color: white"
          @click="addRow"
          v-if="isNormalPageType || page.struct.command?.add"
          >{{ page.struct.command?.add?.label ?? "新增" }}</el-button
        >
        <slot name="command" :row="selectedRow" v-else></slot>
      </div>
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
            align="center"
          >
            <!-- 自定义动态列Slot -->
            <template #default="scope" v-if="item.slotName">
              <slot :name="item.slotName" :row="scope.row"></slot>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          :width="page.struct.table.operationColumnWidth ?? 120"
          align="center"
          v-if="!page.struct.table.hiddenOperationColumn"
        >
          <template #default="scope">
            <div style="display: flex">
              <slot name="operation" :row="scope.row">
                <!-- 如果外面没有使用这个slot，使用下面默认的 -->
                <el-button
                  :icon="Edit"
                  :color="varColor.warningColor"
                  @click="handleEdit(scope.$index, scope.row)"
                ></el-button>
                <el-button
                  :icon="Delete"
                  :color="varColor.dangerColor"
                  @click="handleDelete(scope.$index, scope.row)"
                ></el-button>
              </slot>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        v-model:page-size="searchParams.searchPageSize"
        :page-sizes="[10, 20, 30]"
        :page-count="pageCount"
        :current-page="searchParams.searchIndex"
        :total="total"
        @current-change="changePageIndex"
      />
    </el-card>
    <DataDialog
      :visible="showDialog"
      :config="dialogConfig!"
      @close="onDialogClose"
      v-if="page.struct.dialogConfig"
    ></DataDialog>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import varColor from "@/styles/define.module.scss";
import { Search, Refresh, Plus, Edit, Delete } from "@element-plus/icons-vue";
import DataDialog from "./DataDialog.vue";
import { ElMessageBox } from "element-plus";
import { OperationNamed, Page, SearchParams } from "./list-page";
import dayjs from "dayjs";
import { DialogConfig, Model } from "./data-dialog";

const props = defineProps<{
  page: Page<any>;
  pageCount: number;
  total: number;
}>();
const emit = defineEmits<{
  (e: "search", searchParams: SearchParams, tableData: Ref<Model[]>): void;
  (
    e: "operation",
    name: OperationNamed,
    dialogConfig: Ref<DialogConfig<Model>>,
    // 除了name="add"时为空，其它都有值
    selectedRow?: Model
  ): void;
}>();

const tableData = ref<Model[]>([]);
const selectedRow = ref<Model>();
const searchParams = ref<SearchParams>({
  searchIndex: 1,
  searchPageSize: 10,
  searchKeyName: "",
});

const isNormalPageType = !props.page.type || props.page.type == "normal";
const dialogConfig = ref(props.page.struct.dialogConfig);
const showDialog = ref(false);

search();

function search() {
  emit("search", searchParams.value, tableData);
}

function resetSearch() {
  searchParams.value.searchIndex = 1;
  searchParams.value.searchDate = [];
  Object.keys(searchParams.value)
    .filter((k) => !["searchIndex", "searchDate"].includes(k))
    .forEach((k) => (searchParams.value[k] = ""));
  search();
}

function changePageIndex(index: number) {
  searchParams.value.searchIndex = index;
  search();
}

const addRow = () => {
  emit(
    "operation",
    "add",
    dialogConfig as Ref<DialogConfig<Model>>,
    selectedRow.value
  );
  showDialog.value = true;
};

const changeSelectedRow = (row: Model) => {
  selectedRow.value = row;
};

const handleEdit = (index: number, row: Model) => {
  emit("operation", "edit", dialogConfig as Ref<DialogConfig<Model>>, row);
  showDialog.value = true;
};

const handleDelete = (index: number, row: Model) => {
  ElMessageBox.confirm("确定删除吗？", "警告").then(() => {
    emit("operation", "remove", dialogConfig as Ref<DialogConfig<Model>>, row);
  });
};

function onDialogClose(conform: boolean) {
  showDialog.value = false;
  conform && search();
}
</script>

<!-- css module: class名添加hash后缀，在模板里通过$style.xxx引用，如果有命名，通过：名称.xxx -->
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

<style scoped lang="scss">
.el-pagination {
  display: flex;
  margin-top: 15px;
  justify-content: center;
}
</style>
