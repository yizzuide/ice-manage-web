import { Page, SearchParamsProp } from "@/components/views/list-page";
import { useUsersStore } from "../../user/store/usersStore";
import { roleDialogConfig } from "./role-data-dialog";
import { Role } from "../store/roleStore";

export const roleListPageConfig: Page<Role> = {
  perms: {
    add: "sys:role:add",
    update: "sys:role:edit",
    delete: "sys:role:delete",
    assign: "sys:role:assign",
  },
  struct: {
    search: {
      items: [
        {
          type: "text",
          placeholder: "请输入角色名",
          prop: SearchParamsProp.searchKeyName,
        },
      ],
    },
    table: {
      items: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "roleCode",
          label: "角色Code",
          width: 200,
        },
        {
          prop: "roleName",
          label: "角色名",
          width: 120,
        },
        {
          prop: "createUser",
          label: "创建人",
          width: 120,
          format: (row) => {
            const usersStore = useUsersStore();
            if (!usersStore.usersAllSource?.length) {
              return "";
            }
            return (usersStore.usersAllSource.find((user) => user.id == row.createUser)?.nickName ?? "");
          },
        },
        {
          prop: "remark",
          label: "角色描述",
          width: 120,
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: 200,
        },
      ],
    },
    dialogConfig: roleDialogConfig,
  },
};
