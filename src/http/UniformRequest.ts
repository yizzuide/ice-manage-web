import { SimpleRequestConfig } from "@/plugins/request";
import { HttpResult } from "./HttpResult";
import { useRequest } from "./Request";

export default function request<T>(
  requestConfig: SimpleRequestConfig
): Promise<HttpResult<T>> {
  return new Promise((resolve, reject) => {
    useRequest()
      .request<HttpResult<T>>(requestConfig)
      .then((data) => {
        data.isSuccess = data.code == 0;
        resolve(data);
      })
      .catch((error) => {
        resolve({ code: -1, isSuccess: false, message: "服务内部错误！" });
      });
  });
}
