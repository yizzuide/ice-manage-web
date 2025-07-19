import { ContentType, RequestInterceptor } from "@/plugins/request";
import { UploadFile, UploadRawFile } from "element-plus";
import { Ref } from "vue";

// dialog operation type
export enum OperationType {
  ADD,
  UPDATE,
  DELETE
}

export interface SelectOptions<T> {
  label: string;
  value: number | string;
  children?: SelectOptions<T>[];
  // 返回true则启用
  displayTest?: (operationType: OperationType, row: T) => boolean;
}

export interface UploadSettings {
  uploadURL: string;
  loadURL: string;
  imageURL?: string;
  handleSuccess: (response: any, file: UploadFile) => void;
  beforeUpload?: (rawFile: UploadRawFile) => boolean;
  handleProcess?: (event: ProgressEvent, file: UploadFile) => void;
}

export interface DialogSettings {
  title: string;
  desc?: string;
  show?: boolean;
  width?: number;
}

export interface ActionSettings extends DialogSettings {
  url: string;
  downloadUrl: string;
  actionBtnName?: string;
}

export interface Board<T> {
  label: string;
  fieldName: string;
  // text is default
  type?: "label" | "text" | "textarea" | "number" | "select" | "checkbox" | "cascaded" | "colorPicker" | "datePicker" | "timeSelect" | "imageUpload" | "jsonEditor" | "radio" | "videoUpload" | "audioUpload" | "actionButton";
  layoutHeight?: number;
  // 并行显示
  layoutInline?: boolean;
  layoutInlineStart?: boolean;
  layoutInlineMarginRight?: number;
  isDisable?: boolean;
  // 是否为密码框（type='text'）
  isPassword?: boolean;
  // 支持多行输入框（type='text'）| 多选选择框（type='select'）| 级联选择框（type='cascaded'）
  multiple?: boolean;
  // 数字格式为整数
  numberFormatInt?: boolean;
  // 数字用于毫秒（type='number'）
  numberUsedMill?: boolean;
  // 最小数字（type='number'）
  numberMin?: number;
  numberMax?: number;
  // select可过滤（type='select'）
  selectFilterable?: boolean;
  // select可选值列表（type='select'）
  selectOptions?: SelectOptions<T>[];
  // selectOptions 选项默认值
  defaultValue?: boolean;
  // cascaded label作为值
  cascadedLabelAsValue?: boolean;
  //cascaded 用于分隔选项的字符
  cascadedSeparator?: string;
  // date值类型（type='datePicker'）
  dateValueFormat?: string;
  // time类型（type='timeSelect'）
  timeStep?: string;
  // 上传配置
  uploadSettings?: UploadSettings;
  // 自定义动作按钮配置
  actionSettings?: ActionSettings;
  // 自定义属性配置
  customProps?: any;

  // 显示判断，返回true则显示（type='text'）
  displayTest?: (operationType: OperationType, row: T) => boolean;
  // 禁用判断，返回true则禁用
  disableTest?: (operationType: OperationType, row: T) => boolean;
  // 选择框change事件
  selectChange?: (data: {value: any, boards: Ref<Board<T>[]>}) => void;
  // 数据输出格式化
  format?: (value: any, operationType: OperationType, row: Ref<T>) => any;
}

export interface DialogConfig<T> {
  type?: "normal" | "readonly";
  width?: string;
  title: string;
  desc?: string;
  rules?: Record<string, any>;
  model: Partial<T>;
  board: Board<T>[];
  request: {
    url: string;
    method: "get" | "post" | "put";
    type?: ContentType;
    ignoreEmitLog?: boolean;
    interceptor?: RequestInterceptor;
    /**
     * 请求前处理
     * @param data 请求参数
     * @returns true继续请求，false为取消请求
     */
    beforeRequest?: (data: Readonly<T>) => boolean;
    /**
     * 请求数据格式化
     * @param data  request data
     * @returns 格式化后的数据（必需返回）
     */
    requestDataFormat?: (data: T) => any;
  };
  /**
   * 面板显示前调用
   * @param boards 面板结构
   * @param model 模型数据
   */
  beforeRender?: (boards: Ref<Board<T>[]>, model: Readonly<T>) => void;
}

export interface LogData {
  recordId: number;
  pageName: string;
  type: OperationType;
  beforeValue: string;
  afterValue: string;
}
