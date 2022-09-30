import axios, { AxiosRequestConfig, type AxiosInstance } from "axios";
import type {
  RequestConfig,
  IHttpRequest,
  RequestInterceptor,
} from "./http-request";

export default class HttpRequest implements IHttpRequest {
  axiosInstance: AxiosInstance;
  static globalInterceptor?: RequestInterceptor;
  constructor(config?: RequestConfig) {
    this.axiosInstance = axios.create({
      ...config,
    });

    // 请求实例的拦截
    this.axiosInstance.interceptors.request.use(
      config?.interceptors?.onRequest,
      config?.interceptors?.onRequestCatch
    );
    this.axiosInstance.interceptors.response.use(
      config?.interceptors?.onResponse,
      config?.interceptors?.onResponseCatch
    );

    // 全局拦截器
    if (HttpRequest.globalInterceptor) {
      this.axiosInstance.interceptors.request.use(
        HttpRequest.globalInterceptor.onRequest,
        HttpRequest.globalInterceptor.onRequestCatch
      );
      this.axiosInstance.interceptors.response.use(
        HttpRequest.globalInterceptor.onResponse,
        HttpRequest.globalInterceptor.onResponseCatch
      );
    }
  }

  static setGlobalInterceptor(interceptor: RequestInterceptor) {
    HttpRequest.globalInterceptor = interceptor;
  }

  request<T>(
    url: string,
    method: string,
    params?: object,
    interceptor?: RequestInterceptor
  ): Promise<T> {
    let config = {
      url: url,
      method: method,
      params: method.toLowerCase() === "get" ? params : null,
      data: method.toLocaleLowerCase() !== "get" ? params : null,
    } as AxiosRequestConfig;
    // 当前请求前的拦截
    if (interceptor?.onRequest) {
      config = interceptor.onRequest(config);
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(config)
        .then((result) => {
          // 当前请求响应后的拦截
          if (interceptor?.onResponse) {
            result = interceptor.onResponse(result);
          }
          resolve(result.data);
        })
        .catch((err) => reject(err));
    });
  }
  get<T>(url: string, params?: object): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .get(url, { params })
        .then((result) => resolve(result.data))
        .catch((err) => reject(err));
    });
  }
  post<T>(url: string, data: object): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .post(url, { data })
        .then((result) => resolve(result.data))
        .catch((err) => reject(err));
    });
  }
}
