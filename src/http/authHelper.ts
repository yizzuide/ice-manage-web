import useLocalStorage from "@/hooks/useLocalStorage";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const localStorage = useLocalStorage();
const router = useRouter();

export function getToken() {
  return localStorage.get("token");
}

export function checkAuthFail(code: number) {
  const hasToken = localStorage.get("token");
  // auth fail code，back to login page.
  if (hasToken && code == 401) {
    const valid = validToken();
    if (!valid) {
      router.push("/login");
    }
  }
}

export function validToken(): [string | undefined, boolean] {
  const token = localStorage.get("token");
  if (!token) {
    return [undefined, false];
  }
  const expire = localStorage.get("tokenExpire") as number;
  const isValid = expire > Date.now();
  // auth user need check token is expire
  if (!isValid) {
    localStorage.clear();
    ElMessage.error("登录时间过期，请重新登录！");
  }
  return [token, isValid];
}
