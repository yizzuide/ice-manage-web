import { useUserInfo } from "@/components/login/hooks/useUserInfo";
import {
  DialogConfig,
  Model,
  OperationType,
  SelectOptions,
} from "@/components/views/data-dialog";
import { Page } from "@/components/views/list-page";
import { Ref } from "vue";
import { Department } from "../../department/store/departmentStore";
import { User, useUsersStore } from "../store/usersStore";

export interface ModifierUser extends Model {
  id?: number;
  username: string;
  password?: string;
  realName: string;
  nickName: string;
  gender: number;
  departmentId: number;
  departmentName?: string;
  phone: string;
  email?: string;
}
// department list -> selectOption list
export function initDialogData(
  userListPage: Ref<Page<ModifierUser>>,
  list: Department[]
) {
  const inputItem = userListPage.value.struct.dialogConfig?.board.find(
    (item) => item.fieldName === "departmentId"
  );
  const recurMap = (list: Department[]): SelectOptions[] => {
    return list.map((depart) => ({
      label: depart.departmentName,
      value: depart.id,
      children: recurMap(depart.children ?? []),
    }));
  };
  inputItem!.selectOptions = recurMap(list);
}

export const userDialogConfig: DialogConfig<ModifierUser> = {
  title: "",
  request: {
    url: "",
    method: "post",
  },
  model: <ModifierUser>{},
  rules: {
    username: [
      {
        required: true,
        message: "用户名不能为空！",
        trigger: "blur",
      },
    ],
    realName: [
      {
        required: true,
        message: "真实姓名不能为空！",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "密码不能为空！",
        trigger: "blur",
      },
      {
        min: 6,
        message: "密码长度为6位以上！",
        trigger: "blur",
      },
    ],
    nickName: [
      {
        required: true,
        message: "昵称不能为空！",
        trigger: "blur",
      },
    ],
    phone: [
      {
        required: true,
        message: "手机不能为空！",
        trigger: "blur",
      },
    ],
  },
  board: [
    {
      label: "用户名",
      fieldName: "username",
    },
    {
      label: "密码",
      fieldName: "password",
      isPassword: true,
      displayTest: (operationType, row) => {
        if (operationType == OperationType.ADD) {
          return true;
        }
        const userInfo = useUserInfo();
        const currUserId = userInfo.uid;
        const isAdmin = userInfo.isAdmin;
        if (isAdmin || currUserId === row.id) {
          return true;
        }
        return false;
      },
      format: (value, operationType, model) => {
        if (operationType == OperationType.ADD) {
          return value;
        }
        const usersStore = useUsersStore();
        // password not update?
        if (value === usersStore.findUserById(model.id)?.password) {
          return undefined;
        }
        return value;
      },
    },
    {
      label: "真实名称",
      fieldName: "realName",
    },
    {
      label: "昵称",
      fieldName: "nickName",
    },
    {
      type: "select",
      label: "性别",
      fieldName: "gender",
      selectOptions: [
        {
          label: "男",
          value: 0,
        },
        {
          label: "女",
          value: 1,
        },
      ],
    },
    {
      label: "手机号",
      fieldName: "phone",
    },
    {
      label: "邮箱",
      fieldName: "email",
    },
    {
      type: "cascaded",
      label: "选择部门",
      fieldName: "departmentId",
      customProps: {
        filterable: true,
      },
      selectOptions: [],
    },
  ],
};
