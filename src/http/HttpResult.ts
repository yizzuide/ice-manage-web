export declare interface HttpResult<T> {
  code: number;
  isSuccess: boolean;
  message: string;
  data?: T;
}
