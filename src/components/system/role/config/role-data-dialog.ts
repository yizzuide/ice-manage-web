import { DialogConfig } from "@/components/views/data-dialog";
import { Model } from "echarts";

export interface ModifierRole extends Model {
  id?: number;
  roleCode: string;
  roleName: string;
  remark: string;
}

export const roleDialogConfig: DialogConfig<ModifierRole> = {
  title: "",
  model: <ModifierRole>{},
  request: {
    url: "",
    method: "post",
  },
  board: [
    {
      label: "角色Code",
      fieldName: "roleCode",
    },
    {
      label: "角色名",
      fieldName: "roleName",
    },
    {
      label: "角色描述",
      fieldName: "remark",
    },
  ],
};
