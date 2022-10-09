import axios, {AxiosResponse, type AxiosInstance} from "axios";
import type {
  RequestConfig,
  IHttpRequest,
  RequestInterceptor,
  SimpleRequestConfig,
} from "./http-request";

export default class HttpRequest implements IHttpRequest {
  static globalInterceptor?: RequestInterceptor;
  axiosInstance: AxiosInstance;

  constructor(config?: RequestConfig) {
    this.axiosInstance = axios.create({
      ...config,
    });

    // 请求实例的拦截
    this.axiosInstance.interceptors.request.use(
      config?.interceptor?.onRequest,
      config?.interceptor?.onRequestCatch
    );
    this.axiosInstance.interceptors.response.use(
      config?.interceptor?.onResponse,
      config?.interceptor?.onResponseCatch
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

  request<T>(requestConfig: SimpleRequestConfig): Promise<T> {
    let config = {
      url: requestConfig.url,
      method: requestConfig.method,
      params:
        requestConfig.method.toLowerCase() === "get"
          ? requestConfig.params
          : null,
      data:
        requestConfig.method.toLocaleLowerCase() !== "get"
          ? requestConfig.params
          : null,
      showLoading: requestConfig.showLoading ?? false,
    } as RequestConfig;
    // 当前请求前的拦截
    if (requestConfig.interceptor?.onRequest) {
      config = requestConfig.interceptor.onRequest(config);
    }
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<T, AxiosResponse<T>>(config)
        .then((result) => {
          // 当前请求响应后的拦截
          if (requestConfig.interceptor?.onResponse) {
            result = requestConfig.interceptor.onResponse(result);
          }
          resolve(result.data);
        })
        .catch((err) => reject(err));
    });
  }
}
