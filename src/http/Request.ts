import { AxiosRequestConfig } from "axios";
import { App } from "vue";
import useLocalStorage from "../hooks/useLocalStorage";
import HttpRequest from "../plugins/HttpRequest";
import { ElLoading } from "element-plus";
import { LoadingInstance } from "element-plus/es/components/loading/src/loading";

let instance: HttpRequest;

export function useRequest(): HttpRequest {
  return instance;
}

export function Request(_: App) {
  let loading: LoadingInstance;
  HttpRequest.setGlobalInterceptor({
    onRequest(config: AxiosRequestConfig) {
      console.log("全局拦截: ", config.url);
      loading = ElLoading.service({
        lock: true,
        text: "请求加载中...",
        background: "rgba(0, 0, 0, 0.1)",
      });
      return config;
    },
    onResponse(response) {
      loading.close();
      if (response.data.code !== 0) {
        console.log("请求出错：", response.data.message);
      }
      return response;
    },
    onResponseCatch(error) {
      loading.close();
      if (error.response.status >= 400) {
        console.log("服务器响应出错：", error);
      }
      return error;
    },
  });

  instance = new HttpRequest({
    baseURL: import.meta.env.__HOST_URL,
    timeout: import.meta.env.__REQUEST_TIME_OUT,
    interceptors: {
      onRequest(config) {
        const { url, method } = config;
        console.log("实例拦截: ", url);

        // 添加token header
        const token = useLocalStorage("token");
        if (token.value && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
    },
  });
}
