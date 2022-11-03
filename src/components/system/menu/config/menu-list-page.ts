import { Page } from "@/components/views/list-page";
import { menuDialogConfig, ModifierMenu } from "./menu-data-dialog";

export const menuListPage: Page<ModifierMenu> = {
  struct: {
    search: {
      firstInput: {
        placeholder: "请输入菜单名",
      },
    },
    table: {
      items: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "label",
          label: "名称",
          width: 200,
        },
        {
          prop: "icon",
          label: "图标",
          width: 150,
        },
        {
          prop: "type",
          label: "类型",
          width: 150,
        },
        {
          prop: "code",
          label: "授权编码",
          width: 150,
        },
        {
          prop: "routePath",
          label: "路由路径",
          width: 150,
        },
        {
          prop: "routeName",
          label: "路由名",
          width: 150,
        },
        {
          prop: "componentPath",
          label: "组件路径",
          width: 150,
        },
        {
          prop: "order",
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
    dialogConfig: menuDialogConfig,
  },
};
