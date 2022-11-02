import { ref } from "vue";
import { DialogConfig } from "./dialog";

export const dialogConfig = ref<DialogConfig>({
  title: "",
  request: {
    url: "",
    method: "post",
  },
  model: {
    departmentName: "",
    phone: "",
    address: "",
    orderNum: 0,
    pid: 0,
    parentName: "",
  },
  rules: {
    departmentName: [
      {
        required: true,
        message: "部门名称不能为空！",
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
});
