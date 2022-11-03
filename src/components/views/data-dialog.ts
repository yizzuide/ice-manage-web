import { Model } from "./list-page";

interface Board {
  type?: "text" | "number" | "select";
  isPassword?: boolean;
  isDisable?: boolean;
  label: string;
  fieldName: string;
  selectValues?: [];
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
