<template>
  <div>
    <el-card>
      <div :class="$style.interactRow" v-if="page.struct.search.items">
        <div
          :class="$style.interactRow"
          v-if="!page.struct.search.custom">
          <div
            :class="$style.searchItem"
            v-for="item in page.struct.search.items"
            :key="item.prop">
            <el-input
              :placeholder="item.placeholder"
              v-model="searchParams[item.prop]"
              :formatter="(value: string) => value.replace(/\s/g, '')"
              clearable
              style="width: 180px"
              v-if="item.type == 'text'">
            </el-input>
            <el-select
              :placeholder="item.placeholder"
              v-model="searchParams[item.prop]"
              :filterable="item.selectFilterable"
              style="width: 180px"
              v-else-if="item.type == 'select'">
              <el-option
                v-for="opt in item.selectOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value" />
            </el-select>
            <el-date-picker
              v-model="searchParams[item.prop]"
              type="daterange"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-value="[dayjs().subtract(1, 'month').toDate(), dayjs().toDate()]"
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
          v-permission="page.perms.add"
          v-if="(isNormalPageType || page.struct.command?.add)"
          >{{ page.struct.command?.add?.label ?? "新增" }}</el-button>
        <slot name="command" v-else></slot>
        <el-button
        :icon="Download"
        :color="varColor.primaryColor"
        style="color: white"
        @click="onExport">
        {{ page.struct.command?.export?.label ?? "导出" }}
        </el-button>
        <slot name="additionCommand"></slot>
      </div>
      <el-table
        id="el-table"
        ref="listTable"
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        :max-height="windowH"
        row-key="id"
        :default-expand-all="!page.struct.table.disableExpandAll"
        highlight-current-row
        @row-click="clickRow"
        @current-change="changeSelectedRow">
        <el-table-column type="selection" width="50" />
        <template v-for="item in page.struct.table.items" :key="item.prop">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width ?? 120"
            :formatter="item.format"
            align="center"
            :show-overflow-tooltip="true">
            <!-- 自定义动态列Slot -->
            <template #default="scope" v-if="item.slotName && !item.type">
              <slot :name="item.slotName" :row="scope.row"></slot>
            </template>
            <template #default="scope" v-else-if="item.type == 'image'">
              <img :src="scope.row[item.prop]" width="40" height="40" alt=""/>
            </template>
            <template #default="scope" v-else-if="item.type == 'audio'">
              <audio controls style="width:100px;height:40px" >
                <source :src="scope.row[item.prop]" type="audio/wav">
              </audio>
            </template>
            <template #default="scope" v-else-if="item.type == 'video'">
              <video controls style="width:114px;height:69px" :src="scope.row[item.prop]" >
              </video>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          label="操作"
          :width="page.struct.table.operationColumnWidth ?? 120"
          align="center"
          v-if="page.type !== 'readonly' || !page.struct.table.hiddenOperationColumn">
          <template #default="scope">
            <div style="display: flex">
              <slot name="operation" :row="scope.row">
                <!-- 如果外面没有使用这个slot，使用下面默认的 -->
                <el-button
                  :icon="Edit"
                  :color="varColor.warningColor"
                  @click="handleEdit(scope.$index, scope.row)"
                  v-permission="page.perms.update">
                </el-button>
                <el-button
                  :icon="Delete"
                  :color="varColor.dangerColor"
                  @click="handleDelete(scope.$index, scope.row)"
                  v-permission="page.perms.delete"
                  v-if="isNormalPageType">
                </el-button>
              </slot>
              <slot name="additionOperation" :row="scope.row">
              </slot>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        v-model:page-size="searchParams.searchPageSize"
        :page-sizes="[10, 30, 50, 100, 500, 1000, -1]"
        :page-count="pageCount"
        :current-page="searchParams.searchIndex"
        :total="total"
        @current-change="changePageIndex"
        @size-change="search"
        v-if="!page.struct.table.hiddenPagination" />
    </el-card>
    <DataDialog
      :visible="showDialog"
      :config="dialogConfig as DialogConfig<T>"
      @close="onDialogClose"
      v-if="page.struct.dialogConfig">
    </DataDialog>
  </div>
</template>

<script lang="ts" setup generic="T">
import varColor from "@/styles/define.module.scss";
import { Delete, Edit, Plus, Refresh, Search, Download } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { Ref, nextTick, onMounted, ref } from "vue";
import DataDialog from "./DataDialog.vue";
import { DialogConfig } from "./data-dialog";
import { OperationNamed, Page, SearchParams } from "./list-page";
import useEventBus from "@/hooks/useEventBus";
import * as XLSX from "xlsx";

type ListTable = InstanceType<typeof ElTable>;

// 声明组件选项
defineOptions({
  inheritAttrs: false
});

const props = defineProps<{
  page: Page<T>,
  pageCount: number,
  total: number,
  userOperation?: boolean
}>();

const emit = defineEmits<{
  search: [searchParams: SearchParams, tableData: Ref<T[]>, table: Ref<ListTable>],
  // 操作事件（selectedRow：除了name="add"时为空，其它都有值）
  operation: [name: OperationNamed, dialogConfig: Ref<DialogConfig<T>>, selectedRow?: CancelableRow<T>],
  selectRow: [selectedRow: T]
}>();

const listTable = ref<ListTable>();
const tableData = ref<T[]>([]);
const preTableData = ref<T[]>([]);
const selectedRow = ref<T>();
const searchParams = ref<TypeModel<SearchParams>>({
  searchIndex: 1,
  searchPageSize: 10,
  searchKeyName: "",
});

const isNormalPageType = !props.page.type || props.page.type == "normal";
const dialogConfig = ref(props.page.struct.dialogConfig);

const showDialog = ref(false);
const windowH = ref(0);
const eventBus = useEventBus();


// 监听取消选择行事件，取消单行选择
onMounted(() => {
  windowH.value = window.innerHeight;
  window.addEventListener("resize", () => windowH.value = window.innerHeight);
  eventBus.on("unselect", () => listTable.value?.setCurrentRow(null));
});

search();

function search() {
  Object.keys(searchParams.value)
    .filter((k) => searchParams.value[k] === "")
    .forEach((k) => (searchParams.value[k] = undefined));
  emit("search", searchParams.value, tableData as Ref<T[]>, listTable as Ref<ListTable>);
}

function resetSearch() {
  Object.keys(searchParams.value).forEach(
    (k) => (searchParams.value[k] = undefined)
  );
  searchParams.value.searchIndex = 1;
  searchParams.value.searchPageSize = 10;
  searchParams.value.searchDate = [];
  search();
}

function changePageIndex(index: number) {
  searchParams.value.searchIndex = index;
  search();
}

const addRow = () => {
  let row: CancelableRow<T> | undefined = undefined;
  if (selectedRow.value) {
    row = <CancelableRow<T>>{...selectedRow.value};
  }
  emit("operation", "add", dialogConfig as Ref<DialogConfig<T>>, row);
  showDialog.value = true;
};

const clickRow = (row: T, table: ListTable, event: Event) => {
  if (event.stopPropagation) {
    // 标准浏览器
    event.stopPropagation(); // 阻止事件冒泡
    event.preventDefault(); // 阻止默认事件
  }
  // IE浏览器
  //event.cancelBubble = true;
  //event.returnValue = false;
};

const changeSelectedRow = (row: T) => {
  selectedRow.value = row;
  emit("selectRow", row);
};

const handleEdit = (index: number, row: CancelableRow<T>) => {
  emit("operation", "edit", dialogConfig as Ref<DialogConfig<T>>, row);
  if (row.canceled) {
    return;
  }
  showDialog.value = true;
};

const handleDelete = (index: number, row: CancelableRow<T>) => {
  ElMessageBox.confirm("确定删除吗？", "警告").then(() => {
    emit("operation", "remove", dialogConfig as Ref<DialogConfig<T>>, row);
  });
};

function onDialogClose(conform: boolean, conformWithError: boolean) {
  if (!conform) {
    showDialog.value = false;
    return;
  }
  if (!conformWithError) {
    showDialog.value = false;
    search();
  }
}

// 导出excel需要安装:
// npm install --save xlsx file-saver
// npm i --save-dev @types/file-saver
function onExport() {
  let selectList = listTable.value?.getSelectionRows();
  if (!selectList || !selectList.length) {
    ElMessage.warning("请先选择导出的行！");
    return;
  }
  preTableData.value = tableData.value;
  selectList = JSON.parse(JSON.stringify(selectList));
  if(selectList === undefined) {
    return;
  }
  selectList.forEach((item: any) => {
    item.downloading = true;
  });
  // 将选择的行赋值给表格Data
  tableData.value = selectList;
  // 在下一个渲染周期调用
  nextTick(saveXLSXFile);
}

function saveXLSXFile() {
  let filename = props.page.struct.command?.export?.fileName ?? "table_data.xlsx";
  const elTable = document.getElementById("el-table");
  const xlsxParam = { raw: true }; //转化成Excel使用原始格式
  const workbook = XLSX.utils.table_to_book(elTable, xlsxParam);
  XLSX.writeFileXLSX(workbook, filename, { bookType: "xlsx", bookSST: true, type: "array" });
  // 加载原有数据
  tableData.value = preTableData.value;
}

</script>

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

<style scoped lang="scss">
.el-pagination {
  display: flex;
  margin-top: 15px;
  justify-content: center;
}
</style>
