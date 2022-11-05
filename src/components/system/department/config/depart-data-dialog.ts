import { DialogConfig, Model } from "@/components/views/data-dialog";

export interface ModifierDepartment extends Model {
  id?: number;
  departmentName: string;
  phone: string;
  address: string;
  orderNum: number;
  pid?: number;
  parentName?: string;
}

export const departDialogConfig: DialogConfig<ModifierDepartment> = {
  title: "",
  request: {
    url: "",
    method: "post",
  },
  model: <ModifierDepartment>{},
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
