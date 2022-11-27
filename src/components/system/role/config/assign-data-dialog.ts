import { DialogConfig, SelectOptions } from "@/components/views/data-dialog";
import { ContentType } from "@/plugins/request";
import { Ref } from "vue";
import { Menu } from "../../menu/store/menuStore";

export interface RolePerm {
  roleId: number;
  permIds: number[];
}

export function initDialogData(
  dataConfig: Ref<DialogConfig<RolePerm>>,
  list: Menu[]
) {
  const inputItem = dataConfig.value.board.find(
    (item) => item.fieldName === "permIds"
  );
  const recurMap = (list: Menu[]): SelectOptions[] => {
    return list.map((menu) => ({
      label: menu.label,
      value: menu.id,
      children: recurMap(menu.children ?? []),
    }));
  };
  inputItem!.selectOptions = recurMap(list);
}

export const assignDialogConfig: DialogConfig<RolePerm> = {
  title: "分配权限",
  request: {
    url: "/api/manage/role/assign",
    method: "post",
    type: ContentType.FORM,
  },
  model: <RolePerm>{},
  board: [
    {
      label: "角色ID",
      fieldName: "roleId",
      isDisable: true,
    },
    {
      type: "cascaded",
      label: "选择权限",
      fieldName: "permIds",
      selectOptions: [],
      multiple: true,
      format(value) {
        return [...new Set((value as []).flat())];
      },
    },
  ],
};
