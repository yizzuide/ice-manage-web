export declare interface HttpResult<T> {
  code: number;
  isSuccess: boolean;
  message: string;
  data?: T;
}

export declare interface PageData<T> {
  totalSize: number;
  pageCount: number;
  list: T[];
}

export declare interface QueryData<T> {
  startDate?: Date;
  endDate?: Date;
  // Partial: 使泛型T的所有属性变为可选类型
  entity?: Partial<T>;
}

export declare interface QueryPageData<T> extends QueryData<T> {
  pageStart: number;
  pageSize: number;
}
