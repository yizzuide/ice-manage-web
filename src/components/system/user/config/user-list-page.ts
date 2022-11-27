import { Page, SearchParamsProp } from "@/components/views/list-page";
import { ModifierUser, userDialogConfig } from "./user-data-dialog";

export const userListPage: Page<ModifierUser> = {
  perms: {
    add: "sys:user:add",
    update: "sys:user:edit",
    delete: "sys:user:delete",
    assign: "sys:user:assign",
  },
  struct: {
    search: {
      items: [
        {
          type: "text",
          placeholder: "请输入用户名",
          prop: SearchParamsProp.searchKeyName,
        },
        {
          type: "text",
          placeholder: "请输入真实姓名",
          prop: "realName",
        },
        {
          type: "text",
          placeholder: "请输入手机号码",
          prop: "phone",
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
          prop: "username",
          label: "用户名",
          width: 200,
        },
        {
          prop: "nickName",
          label: "昵称",
          width: 120,
        },
        {
          prop: "realName",
          label: "真实姓名",
          width: 120,
        },
        {
          prop: "gender",
          label: "姓别",
          width: 80,
          format: (row) => (row.gender ? "女" : "男"),
        },
        {
          prop: "departmentName",
          label: "所在部门",
          width: 120,
        },
        {
          prop: "phone",
          label: "电话",
          width: 150,
        },
        {
          prop: "email",
          label: "邮箱",
          width: 150,
        },
        {
          prop: "isAdmin",
          label: "超级管理员",
          width: 120,
          format: (row) => (row.isAdmin ? "是" : "否"),
        },
        {
          prop: "isEnabled",
          label: "是否可用",
          width: 80,
          format: (row) => (row.isEnabled ? "是" : "否"),
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: 200,
        },
      ],
    },
    dialogConfig: userDialogConfig,
  },
};
