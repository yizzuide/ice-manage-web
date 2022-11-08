import { DialogConfig, Model, SelectOptions } from "./data-dialog";

export type OperationNamed = "add" | "edit" | "remove";

export enum SearchParamsProp {
  searchKeyName = "searchKeyName",
  searchDate = "searchDate",
}

export type SearchParams<T extends Model> = {
  searchIndex: number;
  searchKeyName?: string;
  searchDate?: Date[];
  entity?: T;
};

export interface SearchItem {
  type: "text" | "select" | "date";
  placeholder: string;
  prop: string;
  inputSettings: Record<string, any>;
  selectOptions: SelectOptions[];
}

export interface TableItem<T> {
  prop: string;
  label: string;
  width?: number;
  format?: (row: T) => string;
}

export interface Page<T extends Model> {
  // 默认为normal（支持add/edit/remove），readonly方式为自定义（slot=command/operation）
  type?: "normal" | "readonly";
  struct: {
    search: {
      // 是否需要自定义（添加slot="search"），默认为false
      custom?: boolean;
      // 第一个搜索条件（custom=false时，不为空）
      firstInput?: {
        placeholder: string;
      };
      items: SearchItem[];
    };
    command?: {
      add?: {
        label: string;
      };
    };
    table: {
      // 是否隐藏操作列表
      hiddenOperationColumn?: boolean;
      items: TableItem<T>[];
    };
    dialogConfig?: DialogConfig<T>;
  };
}
