import useLocalStorage from "@/hooks/useLocalStorage";
import { SimpleRequestConfig } from "@/plugins/request";
import { checkAuthFail } from "./authHelper";
import { HttpResult } from "./HttpResult";
import { useRequest } from "./Request";

export function cachedRequest<T>(
  requestConfig: SimpleRequestConfig,
  cachedName: string,
  beforeCache: (data: T) => any[] | void
) {
  requestConfig.interceptor = {
    onResponse(response) {
      const respData = response.data as HttpResult<T>;
      if (respData.code == 0 && respData.data) {
        const data = respData.data;
        const localStorage = useLocalStorage();
        const cacheDataList = beforeCache(data);
        const index = cachedName.indexOf(",");
        // 单个缓存
        if (index < 0) {
          // 返回指定缓存数据
          if (cacheDataList && cacheDataList.length > 0) {
            localStorage.set(cachedName, cacheDataList[0]);
          } else {
            localStorage.set(cachedName, data);
          }
        } else {
          // 分组缓存
          if (cacheDataList) {
            const cachedKeys = cachedName.split(",");
            for (let i = 0; i < cachedKeys.length; i++) {
              const cachedKey = cachedKeys[i];
              const cachedData = cacheDataList[i];
              localStorage.set(cachedKey, cachedData);
            }
          }
        }
      }
      return response;
    },
    ...requestConfig.interceptor,
  };
  return request<T>(requestConfig);
}

export default function request<T>(
  requestConfig: SimpleRequestConfig
): Promise<HttpResult<T>> {
  return new Promise((resolve, reject) => {
    useRequest()
      .request<HttpResult<T>>(requestConfig)
      .then((data) => {
        data.isSuccess = data.code == 0;
        checkAuthFail(data.code);
        resolve(data);
      })
      .catch((error) => {
        // http status code > 4xx -> error data
        resolve({ code: -1, isSuccess: false, message: "服务内部错误！" });
      });
  });
}
