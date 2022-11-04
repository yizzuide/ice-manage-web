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
  // normal is default
  type?: "normal" | "readonly";
  struct: {
    search: {
      firstInput: {
        placeholder: string;
      };
    };
    table: {
      hiddenOperationColumn?: boolean;
      items: TableItem<T>[];
    };
    dialogConfig?: DialogConfig<T>;
  };
}
