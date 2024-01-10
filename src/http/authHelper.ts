import useLocalStorage from "@/hooks/useLocalStorage";
import router from "@/router";
import { ElMessage } from "element-plus";
import { toNumber } from "lodash";

const tokenName: string = import.meta.env.__TOKEN_NAME;
const localStorage = useLocalStorage();

export function getToken(): string {
  return localStorage.get(tokenName);
}

export function setToken(token: string) {
  localStorage.set(tokenName);
}

export function removeToken() {
  localStorage.remove(tokenName);
}

export function getUserId(): number {
  return toNumber(localStorage.get("userId"));
}

export function setUserId(userId: number) {
  localStorage.set("userId", userId);
}

export function removeUserId() {
  localStorage.remove("userId");
}

export function checkResponse(data: any) {
  if (data == undefined) {
    ElMessage.error("服务器连接失败，请稍后再试！");
    return false;
  }
  return true;
}

export function checkAuthFail(code: number) {
  // auth fail code，back to login page.
  if (code == 401) {
    // remove token
    removeToken();
    router.replace({ name: "login" }).then(() => {});
    return false;
  }
  return true;
}

export function validToken(): [string | undefined, boolean] {
  let token: string | undefined = getToken();
  if (!token) {
    return [token, false];
  }
  const expire = toNumber(localStorage.get("tokenExpire"));
  const isValid = expire > Date.now();
  // auth user need check token is expire
  if (!isValid) {
    token = undefined;
    localStorage.clear();
    ElMessage.error("登录时间过期，请重新登录！");
  }
  return [token, isValid];
}
