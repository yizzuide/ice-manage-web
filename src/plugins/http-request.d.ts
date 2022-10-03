import type { AxiosRequestConfig, AxiosResponse } from "axios"

declare interface IHttpRequest {
  request<T>(requestConfig: SimpleRequestConfig): Promise<T>
}

declare interface RequestInterceptor<T = any, R = AxiosResponse<T, any>> {
  onRequest?(config: RequestConfig): RequestConfig,
  onRequestCatch?(error: any): any,
  onResponse?(response: R): R,
  onResponseCatch?(error: any): any,
}

declare interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  interceptor?: RequestInterceptor
}

declare interface SimpleRequestConfig {
  url: string,
  method: string,
  params?: any,
  showLoading?: boolean,
  interceptor?: RequestInterceptor
}


export {
  IHttpRequest,
  RequestConfig,
  SimpleRequestConfig,
  RequestInterceptor
}
