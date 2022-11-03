import { DialogConfig } from "./data-dialog";

export type Model = Record<string, any>;

export type SearchParams = {
  searchName?: string;
  searchDate?: Date[];
};

export interface TableItem {
  prop: string;
  label: string;
  width?: number;
}

export interface Page {
  type: "readonly" | "normal";
  struct: {
    search: {
      firstInput: {
        placeholder: string;
      };
    };
    table: {
      items: TableItem[];
    };
    dialogConfig?: DialogConfig;
  };
}
