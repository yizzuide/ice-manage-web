import { App } from "vue";
import HttpRequest from "../plugins/HttpRequest";
import { ElLoading } from "element-plus";
import { LoadingInstance } from "element-plus/es/components/loading/src/loading";
import { getToken, setToken } from "./authHelper";
import { AxiosHeaders } from "axios";

let instance: HttpRequest;

export function useRequest(): HttpRequest {
  // 如果为空，重新加载
  !instance && Request();
  return instance;
}

export function Request(_?: App) {
  let loading: LoadingInstance;
  HttpRequest.setGlobalInterceptor({
    onRequest(config) {
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
      loading?.close();
      return response;
    },
    onResponseCatch(error) {
      loading?.close();
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
        if (url !== "/api/login") {
          const token = getToken();
          if (token) {
            config.headers.token = `Bearer ${token}`;
          }
        }
        return config;
      },
      onResponse(response) {
        // 检测响应头是否有自动刷新的token
        const token = response.headers["token"];
        if (token) {
          setToken(token);
        }
        return response;
      },
    },
  });
}
