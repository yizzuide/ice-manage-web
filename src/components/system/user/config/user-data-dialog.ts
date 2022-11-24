import {
  DialogConfig,
  Model,
  SelectOptions,
} from "@/components/views/data-dialog";
import { Page } from "@/components/views/list-page";
import { Ref } from "vue";
import { Department } from "../../department/store/departmentStore";

export interface ModifierUser extends Model {
  id?: number;
  username: string;
  realName: string;
  nickName: string;
  gender: number;
  departmentId: number;
  departmentName: string;
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
