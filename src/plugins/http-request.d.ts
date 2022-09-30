import type { AxiosRequestConfig, AxiosResponse } from "axios"

declare interface IHttpRequest {
  request<T>(url: string, method: string, params?: object): Promise<T>
  get<T>(url: string, params?: object): Promise<T>
  post<T>(url: string, data: object): Promise<T>
}

declare interface RequestInterceptor {
  onRequest?(config: AxiosRequestConfig): AxiosRequestConfig,
  onRequestCatch?(error: any): any,
  onResponse?(response: AxiosResponse<any, any>): AxiosResponse<any, any>,
  onResponseCatch?(error: any): any,
}

declare interface RequestConfig extends AxiosRequestConfig {
  interceptors?: RequestInterceptor
}


export {
  IHttpRequest,
  RequestConfig,
  RequestInterceptor
}
