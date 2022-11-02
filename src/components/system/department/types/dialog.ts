import { ref } from "vue";

interface Board {
  type?: "text" | "number" | "select";
  isPassword?: boolean;
  isDisable?: boolean;
  label: string;
  fieldName: string;
  selectValues?: [];
}

export interface DialogConfig {
  title: string;
  rules?: Record<string, any>;
  model: Record<string, any>;
  board: Board[];
  request: {
    url: string;
    method: "get" | "post" | "put";
  };
}
