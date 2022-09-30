import type { AxiosRequestConfig, AxiosResponse } from "axios"

declare interface IHttpRequest {
  request<T>(requestConfig: SimpleRequestConfig): Promise<T>
}

declare interface RequestInterceptor {
  onRequest?(config: RequestConfig): RequestConfig,
  onRequestCatch?(error: any): any,
  onResponse?(response: AxiosResponse<any, any>): AxiosResponse<any, any>,
  onResponseCatch?(error: any): any,
}

declare interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptor
  showLoading?: boolean
}

declare interface SimpleRequestConfig {
  url: string,
  method: string,
  params?: object,
  showLoading?: boolean,
  interceptor?: RequestInterceptor
}


export {
  IHttpRequest,
  RequestConfig,
  SimpleRequestConfig,
  RequestInterceptor
}
