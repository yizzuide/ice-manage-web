import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { toNumber } from "lodash";

const router = useRouter();
const localStorage = useLocalStorage();

export function getToken(): string {
  return localStorage.get("token");
}

export function checkAuthFail(code: number) {
  // auth fail code，back to login page.
  if (code == 401) {
    ElMessage.error("当前请求授权失败！");
    const valid = validToken();
    if (!valid) {
      router.push("/login");
    }
  }
}

export function validToken(): [string | undefined, boolean] {
  const token = getToken();
  if (!token) {
    return [undefined, false];
  }
  const expire = toNumber(localStorage.get("tokenExpire"));
  const isValid = expire > Date.now();
  // auth user need check token is expire
  if (!isValid) {
    localStorage.clear();
    ElMessage.error("登录时间过期，请重新登录！");
  }
  return [token, isValid];
}
