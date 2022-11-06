export type Model = Record<string, any>;

interface SelectOptions {
  label: string;
  value: number;
}

interface Board {
  // text is default
  type?: "text" | "number" | "select";
  isPassword?: boolean;
  isDisable?: boolean;
  // 多行输入框
  multiLine?: boolean;
  // 数字用于毫秒
  numberUsedMill?: boolean;
  // 最小数字
  numberMin?: number;
  label: string;
  fieldName: string;
  selectValues?: SelectOptions[];
  format?: (value?: string | number) => any;
}

export interface DialogConfig<T extends Model> {
  title: string;
  rules?: Record<string, any>;
  model: T;
  board: Board[];
  request: {
    url: string;
    method: "get" | "post" | "put";
  };
}
