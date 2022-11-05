import { DialogConfig, Model } from "./data-dialog";

export type OperationNamed = "add" | "edit" | "remove";

export type SearchParams = {
  searchIndex: number;
  searchName?: string;
  searchDate?: Date[];
};

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
