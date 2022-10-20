import { SimpleRequestConfig } from "@/plugins/request";
import { HttpResult } from "./HttpResult";
import { useRequest } from "./Request";

export default function request<T>(
  requestConfig: SimpleRequestConfig
): Promise<HttpResult<T>> {
  return new Promise((resolve, reject) => {
    useRequest()
      .request<HttpResult<T>>(requestConfig)
      .then((data) => resolve(data))
      .catch((error) => {
        resolve({ code: -1, message: "服务请求失败！" });
      });
  });
}
