import { Page, SearchParamsProp } from "@/components/views/list-page";
import { departDialogConfig, ModifierDepartment } from "./depart-data-dialog";

export const departListPage: Page<ModifierDepartment> = {
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
