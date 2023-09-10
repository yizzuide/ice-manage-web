import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export declare interface IHttpRequest {
  request<T>(requestConfig: SimpleRequestConfig): Promise<T>;
}

export declare interface RequestInterceptor<T = any, R = AxiosResponse<T, any>> {
  onRequest?(config: RequestConfig): RequestConfig;

  onRequestCatch?(error: any): any;

  onResponse?(response: R): R;

  onResponseCatch?(error: any): any;
}

export declare interface RequestConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean;
  interceptor?: RequestInterceptor;
}

export enum ContentType {
  FORM,
  JSON,
}

export declare interface SimpleRequestConfig {
  url: string;
  method?: string;
  params?: any;
  contentType?: ContentType;
  showLoading?: boolean;
  interceptor?: RequestInterceptor;
}
