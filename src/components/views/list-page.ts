import { DialogConfig, Model } from "./data-dialog";

export type OperationNamed = "add" | "edit" | "remove";

export type SearchParams = {
  searchIndex: number;
  searchName?: string;
  searchDate?: Date[];
};

export interface TableItem {
  prop: string;
  label: string;
  width?: number;
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
      items: TableItem[];
    };
    dialogConfig?: DialogConfig<T>;
  };
}
