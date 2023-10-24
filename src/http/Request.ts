import { App } from "vue";
import HttpRequest from "../plugins/HttpRequest";
import { ElLoading } from "element-plus";
import { LoadingInstance } from "element-plus/es/components/loading/src/loading";
import { getToken, setToken } from "./authHelper";
import { AxiosHeaders } from "axios";
import { RequestConfig } from "@/plugins/request";

let instance: HttpRequest;

export function useRequest(): HttpRequest {
  // 如果为空，重新加载
  !instance && Request();
  return instance;
}

export function Request(_?: App) {
  let loading: LoadingInstance;
  let currentConfig: RequestConfig;
  HttpRequest.setGlobalInterceptor({
    onRequest(config) {
      currentConfig = config;
      if (config.showLoading) {
        loading = ElLoading.service({
          lock: true,
          text: "请求加载中...",
          background: "rgba(0, 0, 0, 0.1)",
        });
      }
      return config;
    },
    onResponse(response) {
      if (currentConfig?.showLoading) {
        loading?.close();
      }
      return response;
    },
    onResponseCatch(error) {
      if (currentConfig?.showLoading) {
        loading?.close();
      }
      return error;
    },
  });

  instance = new HttpRequest({
    baseURL: import.meta.env.__HOST_URL,
    timeout: import.meta.env.__REQUEST_TIME_OUT,
    headers: <AxiosHeaders>{},
    interceptor: {
      onRequest(config) {
        const { url, method } = config;
        // 添加token
        if (url !== import.meta.env.__API_LOGIN_URL) {
          const token = getToken();
          if (token) {
            const token_format: string = import.meta.env.__TOKEN_FORMAT;
            config.headers.token = token_format.replace("%s", token);
          }
        }
        return config;
      },
      onResponse(response) {
        // 检测响应头是否有自动刷新的token
        const token = response.headers[import.meta.env.__TOKEN_NAME];
        if (token) {
          setToken(token);
        }
        return response;
      },
    },
  });
}
