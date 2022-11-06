export type Model = Record<string, any>;

interface SelectOptions {
  label: string;
  value: number;
}

interface Board {
  label: string;
  fieldName: string;
  // text is default
  type?: "text" | "number" | "select";
  isDisable?: boolean;
  // 是否为密码框（type='text'）
  isPassword?: boolean;
  // 支持多行输入框（type='text'）/多选选择框（type='select'）
  multiple?: boolean;
  // 数字用于毫秒（type='number'）
  numberUsedMill?: boolean;
  // 最小数字（type='number'）
  numberMin?: number;
  // select可选值列表（type='select'）
  selectValues?: SelectOptions[];
  // 数据输出格式化
  format?: (value?: any) => any;
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
  };
}
