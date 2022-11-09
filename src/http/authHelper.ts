import useLocalStorage from "@/hooks/useLocalStorage";
import router from "@/router";
import { ElMessage } from "element-plus";
import { toNumber } from "lodash";

const localStorage = useLocalStorage();

export function getToken(): string {
  return localStorage.get("token");
}

export function setToken(token: string) {
  localStorage.set("token", token);
}

export function checkAuthFail(code: number) {
  // auth fail code，back to login page.
  if (code == 401) {
    const valid = validToken()[1];
    if (!valid) {
      router.replace({ name: "login" }).then(() => {});
      return false;
    }
  }
  return true;
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
