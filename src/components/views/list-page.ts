import { DialogConfig, Model, SelectOptions } from "./data-dialog";

export type OperationNamed = "add" | "edit" | "remove";

export enum SearchParamsProp {
  searchKeyName = "searchKeyName",
  searchDate = "searchDate",
}

export interface SearchParams extends Model {
  searchIndex: number;
  searchKeyName?: string;
  searchDate?: Date[];
}

export interface SearchItem {
  type: "text" | "select" | "date";
  placeholder?: string;
  prop?: string;
  // 输入框绑定属性参数
  inputSettings?: Record<string, any>;
  // select选择框
  selectOptions?: SelectOptions[];
}

export interface TableItem<T> {
  prop: string;
  label: string;
  width?: number;
  slotName?: string;
  format?: (row: T) => string;
}

export interface Page<T extends Model> {
  // 默认为normal（支持add/edit/remove），readonly方式为自定义（slot=command/operation）
  type?: "normal" | "readonly";
  struct: {
    search: {
      // 是否需要自定义（添加slot="search"），默认为false
      custom?: boolean;
      items?: SearchItem[];
    };
    command?: {
      add?: {
        label: string;
      };
    };
    table: {
      // 是否隐藏操作列表
      hiddenOperationColumn?: boolean;
      operationColumnWidth?: number;
      items: TableItem<T>[];
    };
    dialogConfig?: DialogConfig<T>;
  };
}
