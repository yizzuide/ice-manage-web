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
  label: string;
  fieldName: string;
  selectValues?: SelectOptions[];
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
