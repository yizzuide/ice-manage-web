import { DialogConfig } from "@/components/views/data-dialog";
import { ContentType } from "@/plugins/request";
import { Ref } from "vue";
import { Role } from "../../role/store/roleStore";

export interface UserRole {
  uid: number;
  roleIds: number[];
}

export function initDialogData(
  dataConfig: Ref<DialogConfig<UserRole>>,
  list: Role[]
) {
  const inputItem = dataConfig.value.board.find(
    (item) => item.fieldName === "roleIds"
  );
  inputItem!.selectOptions = list.map((role) => ({
    label: role.roleName,
    value: role.id,
  }));
}

export const assignDialogConfig: DialogConfig<UserRole> = {
  title: "分配角色",
  desc: "单一角色方式，有利于权限的集中管理",
  request: {
    url: "/api/manage/user/assign",
    method: "post",
    type: ContentType.FORM,
  },
  model: <UserRole>{},
  rules: {
    roleIds: [
      {
        required: true,
        message: "角色不能为空！",
        trigger: "blur",
      },
    ],
  },
  board: [
    {
      label: "用户ID",
      fieldName: "uid",
      isDisable: true,
    },
    {
      type: "cascaded",
      label: "选择角色",
      fieldName: "roleIds",
      selectOptions: [],
    },
  ],
};
