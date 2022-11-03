<template>
  <div>
    <el-card>
      <div class="search-row">
        <div class="search-item">
          <el-input
            placeholder="输入部门名称"
            :prefix-icon="Search"
            v-model="searchDepartmentName"
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
            :default-value="[new Date(2022, 0, 1), new Date(2022, 1, 1)]"
          />
        </div>
        <div class="search-item">
          <el-button :icon="Search" @click="search">搜索</el-button>
        </div>
      </div>
      <el-row>
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
        highlight-current-row
        @current-change="changeSelectedRow"
      >
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="departmentName" label="名称" width="200" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="address" label="地址" width="200" />
        <el-table-column prop="orderNum" label="排序" width="80" />
        <el-table-column prop="createTime" label="添加时间" width="200" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <div style="display: flex">
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
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <DataDialog
      :visible="showDialog"
      :config="dialogConfig"
      @close="onDialogClose"
    ></DataDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search, Plus, Edit, Delete } from "@element-plus/icons-vue";
import { Department, useDepartmentStore } from "./store/departmentStore";
import DataDialog from "../../views/DataDialog.vue";
import { dialogConfig } from "./config/depart-data-dialog";
import { ElMessageBox } from "element-plus";

const departmentStore = useDepartmentStore();
const searchDepartmentName = ref("");
const searchDate = ref<Date[]>();
const tableData = ref(<Department[]>[]);
let selectedRow: Department;
const showDialog = ref(false);

search();

function search() {
  departmentStore
    .fetchPage({
      pageStart: 1,
      pageSize: 10,
      startDate: searchDate.value?.[0],
      endDate: searchDate.value?.[1],
      entity: {
        departmentName: searchDepartmentName.value,
      },
    })
    .then((_) => (tableData.value = departmentStore.departmentList));
}

const addRow = () => {
  dialogConfig.value.title = "添加部门";
  dialogConfig.value.request.url = "/api/department/add";
  dialogConfig.value.model = {
    id: null,
    departmentName: "",
    phone: "",
    address: "",
    orderNum: 0,
    parentName: "",
  };
  if (selectedRow) {
    dialogConfig.value.model.parentName = selectedRow.departmentName;
    dialogConfig.value.model.pid = selectedRow.id;
  }
  showDialog.value = true;
};

const changeSelectedRow = (row: Department) => {
  selectedRow = row;
};

const handleEdit = (index: number, row: Department) => {
  dialogConfig.value.title = "修改部门";
  dialogConfig.value.request.url = "/api/department/update";
  dialogConfig.value.request.method = "put";
  dialogConfig.value.model = {
    id: row.id,
    departmentName: row.departmentName,
    phone: row.phone,
    address: row.address,
    orderNum: row.orderNum,
  };
  showDialog.value = true;
};

const handleDelete = (index: number, row: any) => {
  ElMessageBox.confirm("确定删除吗？", "警告").then(() => {
    departmentStore.removeRecord(row.id).then(() => {
      search();
    });
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
</style>
