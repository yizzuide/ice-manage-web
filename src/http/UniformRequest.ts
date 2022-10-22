import { SimpleRequestConfig } from "@/plugins/request";
import { checkAuthFail } from "./authHelper";
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
        checkAuthFail(data.code);
        resolve(data);
      })
      .catch((error) => {
        // http status code > 4xx -> error data
        resolve({ code: -1, isSuccess: false, message: "服务内部错误！" });
      });
  });
}
