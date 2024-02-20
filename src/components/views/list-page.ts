import { DialogConfig, Model, SelectOptions } from "./data-dialog";

export type OperationNamed = "add" | "edit" | "remove";

export enum SearchParamsProp {
  searchKeyName = "searchKeyName",
  searchDate = "searchDate",
}

export interface SearchParams extends Model {
  searchIndex: number;
  searchPageSize: number;
  searchKeyName?: string;
  searchDate?: Date[];
}

export interface SearchItem<T> {
  type: "text" | "select" | "date";
  placeholder?: string;
  prop: string;
  // 输入框绑定属性参数
  inputSettings?: Record<string, any>;
  // select选择框是否支持过滤
  selectFilterable?: boolean;
  // select选择框选项列表
  selectOptions?: SelectOptions<T>[];
}

export interface TableItem<T extends Model> {
  prop: string;
  label: string;
  width?: number;
  slotName?: string;
  type?: undefined | "image" | "audio" | "video",
  format?: (row: T) => any;
}

export interface Page<T extends Model> {
  // 默认为normal（支持add/edit/remove），audit为审计类型（仅支持修改），readonly方式为自定义（slot=command/operation）
  type?: "normal" | "audit" | "readonly";
  // 动作权限
  perms: {
    add?: string;
    update?: string;
    delete?: string;
    assign?: string;
    detail?: string;
  };
  // 页面结构
  struct: {
    // 搜索行
    search: {
      // 是否需要自定义（添加slot="search"），默认为false
      custom?: boolean;
      items?: SearchItem<T>[];
    };
    command?: {
      add?: {
        label?: string;
      };
      export?: {
        label?: string;
        fileName: string;
      }
    };
    table: {
      // 是否展开子项
      disableExpandAll?: boolean;
      // 是否隐藏分页
      hiddenPagination?: boolean;
      // 是否隐藏操作列表
      hiddenOperationColumn?: boolean;
      operationColumnWidth?: number;
      items: TableItem<T>[];
    };
    // 提交数据对话框
    dialogConfig?: DialogConfig<T>
  };
}
