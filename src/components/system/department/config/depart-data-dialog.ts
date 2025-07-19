import { DialogConfig } from "@/components/views/data-dialog";
import { Department } from "../store/departmentStore";


export const departDialogConfig: DialogConfig<Department> = {
  title: "",
  request: {
    url: "",
    method: "post",
  },
  model: <Department>{},
  rules: {
    departmentName: [
      {
        required: true,
        message: "部门名称不能为空！",
        trigger: "blur",
      },
    ],
    orderNum: [
      {
        required: true,
        message: "排序不能为空！",
        trigger: "blur",
      },
      {
        pattern: /\d+/,
        message: "排序必须为数字！",
        trigger: "blur",
      },
    ],
  },
  board: [
    {
      label: "部门名称",
      fieldName: "departmentName",
    },
    {
      label: "电话",
      fieldName: "phone",
    },
    {
      label: "地址",
      fieldName: "address",
    },
    {
      type: "number",
      label: "排序",
      fieldName: "orderNum",
    },
    {
      label: "所属部门",
      fieldName: "parentName",
      isDisable: true,
    },
  ],
};
