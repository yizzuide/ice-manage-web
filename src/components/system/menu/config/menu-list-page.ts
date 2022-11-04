import { Page } from "@/components/views/list-page";
import { menuDialogConfig, ModifierMenu } from "./menu-data-dialog";

enum MenuType {
  DIRECTORY,
  MENU,
  BUTTON,
}

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
          format: (row) => {
            const type = row.type as MenuType;
            switch (type) {
              case MenuType.DIRECTORY:
                return "目录";
              case MenuType.MENU:
                return "菜单";
              case MenuType.BUTTON:
                return "按钮";
            }
          },
        },
        {
          prop: "code",
          label: "授权编码",
          width: 150,
        },
        {
          prop: "routePath",
          label: "路由路径",
          width: 200,
        },
        {
          prop: "routeName",
          label: "路由名",
          width: 150,
        },
        {
          prop: "componentPath",
          label: "组件路径",
          width: 200,
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
