import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface IHttpRequest {
  request<T>(requestConfig: SimpleRequestConfig): Promise<T>;
}

export interface RequestInterceptor<T = any, R = AxiosResponse<T, any>> {
  onRequest?(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig;

  onRequestCatch?(error: any): any;

  onResponse?(response: R): R;

  onResponseCatch?(error: any): any;
}

export interface RequestConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean;
  interceptor?: RequestInterceptor;
}

export enum ContentType {
  FORM,
  JSON,
}

export interface SimpleRequestConfig {
  url: string;
  method?: string;
  params?: any;
  contentType?: ContentType;
  showLoading?: boolean;
  interceptor?: RequestInterceptor;
}
