import { ContentType } from "@/plugins/request";
import { UploadFile, UploadRawFile } from "element-plus";

export type Model = Record<string, any>;

// dialog operation type
export enum OperationType {
  ADD,
  UPDATE,
}

export interface SelectOptions {
  label: string;
  value: number | string;
  children?: SelectOptions[];
}

export interface UploadSettings {
  uploadURL: string;
  loadURL: string;
  imageURL?: string;
  handleSuccess: (response: any, file: UploadFile) => void;
  beforeUpload?: (rawFile: UploadRawFile) => boolean;
}

export interface Board {
  label: string;
  fieldName: string;
  // text is default
  type?: "text" | "number" | "select" | "cascaded" | "imageUpload";
  isDisable?: boolean;
  // 是否为密码框（type='text'）
  isPassword?: boolean;
  // 支持多行输入框（type='text'）| 多选选择框（type='select'）| 级联选择框（type='cascaded'）
  multiple?: boolean;
  // 数字用于毫秒（type='number'）
  numberUsedMill?: boolean;
  // 最小数字（type='number'）
  numberMin?: number;
  // select可选值列表（type='select'）
  selectOptions?: SelectOptions[];
  // 上传配置
  uploadSettings?: UploadSettings;
  // 自定义属性配置
  customProps?: any;
  // 显示判断（type='text'）
  displayTest?: (operationType: OperationType, row: any) => boolean;
  // 数据输出格式化
  format?: (value: any, operationType: OperationType, row: any) => any;
}

export interface DialogConfig<T extends Model> {
  type?: "normal" | "readonly";
  title: string;
  desc?: string;
  rules?: Record<string, any>;
  model: T;
  board: Board[];
  request: {
    url: string;
    method: "get" | "post" | "put";
    type?: ContentType;
  };
}
