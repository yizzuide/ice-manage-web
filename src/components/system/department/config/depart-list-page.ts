import { Page, SearchParamsProp } from "@/components/views/list-page";
import { departDialogConfig } from "./depart-data-dialog";
import { Department } from "../store/departmentStore";

export const departListPage: Page<Department> = {
  perms: {
    add: "sys:department:add",
    update: "sys:department:edit",
    delete: "sys:department:delete",
  },
  struct: {
    search: {
      items: [
        {
          type: "text",
          placeholder: "请输入部门名",
          prop: SearchParamsProp.searchKeyName,
        },
        {
          type: "date",
          prop: SearchParamsProp.searchDate,
          inputSettings: {
            "start-placeholder": "开始时间",
            "end-placeholder": "结束时间",
          },
        },
      ],
    },
    table: {
      disableExpandAll: true,
      hiddenPagination: true,
      items: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "departmentName",
          label: "名称",
          width: 200,
        },
        {
          prop: "phone",
          label: "电话",
          width: 150,
        },
        {
          prop: "address",
          label: "地址",
          width: 150,
        },
        {
          prop: "orderNum",
          label: "排序",
          width: 80,
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: 200,
        },
      ],
    },
    dialogConfig: departDialogConfig,
  },
};
