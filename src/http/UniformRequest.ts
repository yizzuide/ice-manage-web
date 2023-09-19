import useLocalStorage from "@/hooks/useLocalStorage";
import { SimpleRequestConfig } from "@/plugins/request";
import { checkAuthFail, checkResponse } from "./authHelper";
import { HttpResult } from "./HttpDefine";
import { useRequest } from "./Request";
import { ElMessage } from "element-plus";

interface CachedLocalConfig<T> {
  cachedName: string;
  cacheDataKey?: string;
  beforeCache: (data: T) => any[] | void;
}

interface CachedRequestConfig<T> extends CachedLocalConfig<T> {
  requestConfig: SimpleRequestConfig;
}
export function cachedLocal<T>(data: T, config: CachedLocalConfig<T>) {
  const { cachedName, beforeCache } = config;
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

export function cachedRequest<T>(config: CachedRequestConfig<T>) {
  const { requestConfig, cachedName, cacheDataKey, beforeCache } = config;
  requestConfig.interceptor = {
    onResponse(response) {
      const respData = response.data as HttpResult<T>;
      if (respData.code == 0) {
        const data: any = respData;
        cachedLocal(cacheDataKey ? data[cacheDataKey] : data.data, { cachedName, beforeCache });
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
        if(!checkResponse(data)) {
          reject(data);
          return;
        }
        data.isSuccess = data.code == 0;
        if (checkAuthFail(data.code)) {
          if(!data.isSuccess) {
            ElMessage.error(data.message);
          }
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch((error) => {
        console.log("request error: ", error);
        // http status code > 4xx -> error data
        resolve({ code: -1, isSuccess: false, message: "服务内部错误！" });
      });
  });
}
