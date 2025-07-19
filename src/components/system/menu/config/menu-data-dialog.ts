import { DialogConfig } from "@/components/views/data-dialog";
import { Menu } from "../store/menuStore";


export const menuDialogConfig: DialogConfig<Menu> = {
  title: "",
  request: {
    url: "",
    method: "post",
  },
  model: <Menu>{},
  rules: {
    label: [
      {
        required: true,
        message: "菜单名称不能为空！",
        trigger: "blur",
      },
    ],
    code: [
      {
        required: true,
        message: "授权码不能为空！",
        trigger: "blur",
      },
    ],
    type: [
      {
        required: true,
        message: "类型不能为空！",
        trigger: "blur",
      },
    ],
    order: [
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
      label: "菜单名",
      fieldName: "label",
    },
    {
      label: "图标",
      fieldName: "icon",
    },
    {
      label: "授权码",
      fieldName: "code",
    },
    {
      type: "select",
      label: "类型",
      fieldName: "type",
      selectOptions: [
        {
          label: "菜单目录",
          value: 0,
        },
        {
          label: "菜单",
          value: 1,
        },
        {
          label: "按钮",
          value: 2,
        },
      ],
    },
    {
      label: "路由路径",
      fieldName: "routePath",
    },
    {
      label: "路由名",
      fieldName: "routeName",
    },
    {
      label: "组件路径",
      fieldName: "componentPath",
    },
    {
      type: "number",
      label: "排序",
      fieldName: "order",
    },
    {
      label: "所属父节点",
      fieldName: "parentName",
      isDisable: true,
    },
  ],
};
