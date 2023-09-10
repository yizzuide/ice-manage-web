import { DialogConfig } from "@/components/views/data-dialog";
import { Role } from "../store/roleStore";

export const roleDialogConfig: DialogConfig<Role> = {
  title: "",
  model: <Role>{},
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
