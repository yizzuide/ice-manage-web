import { defineStore } from "pinia";
import { ContentType } from "@/plugins/request";
import useLocalStorage from "@/hooks/useLocalStorage";
import request from "@/http/UniformRequest";
import { HttpResult } from "@/http/HttpResult";

interface UserInfo {
  uid: number;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  department: string;
  isAdmin: boolean;
  perms: [];
}

interface Menu {
  name: string;
  icon?: string;
  routeName: string;
  routePath: string;
  componentPath: string;
  children?: Menu[];
}

export default defineStore("user", {
  state: () => {
    return {
      // 使用立即执行函数初始化
      userInfo: (function () {
        // 从缓存加载
        const localStorage = useLocalStorage();
        const cachedUserInfo = localStorage.get("userInfo");
        return cachedUserInfo ? (cachedUserInfo as UserInfo) : <UserInfo>{};
      })(),
      menuList: (function () {
        const localStorage = useLocalStorage();
        const cachedMenus = localStorage.get("menuList");
        return cachedMenus ? (cachedMenus as Menu[]) : <Menu[]>{};
      })(),
    };
  },
  getters: {},
  actions: {
    async fetchMenuList(loading: boolean) {
      return request<Menu[]>({
        url: "/api/manage/user/menu",
        method: "get",
        showLoading: loading,
        interceptor: {
          onResponse: (response) => {
            const respData = response.data as HttpResult<Menu[]>;
            if (respData.code == 0) {
              this.menuList = respData.data;
              // 添加工作台菜单
              this.menuList?.unshift({
                name: "工作台",
                routeName: "workbench",
                routePath: "/home/workbench",
                componentPath: "/home/WorkbenchPage.vue",
              });
              const localStorage = useLocalStorage();
              localStorage.set("menuList", this.menuList);
            }
            return response;
          },
        },
      });
    },
    async fetchUserInfo(loading: boolean) {
      return request<UserInfo>({
        url: "/api/manage/user/info",
        method: "get",
        showLoading: loading,
        interceptor: {
          onResponse: (response) => {
            const respData = response.data as HttpResult<UserInfo>;
            if (respData.code == 0) {
              this.userInfo = respData.data;
              const localStorage = useLocalStorage();
              localStorage.set("userInfo", this.userInfo);
            }
            return response;
          },
        },
      });
    },
    async accountLogin(username: string, password: string, code: string) {
      return request<any>({
        url: "/api/login",
        params: {
          username,
          password,
          code,
        },
        method: "post",
        contentType: ContentType.FORM,
        showLoading: true,
        interceptor: {
          onResponse(response) {
            const respData = response.data as HttpResult<any>;
            if (respData.code == 0) {
              const localStorage = useLocalStorage();
              localStorage.set("token", respData.data.token);
              localStorage.set("tokenExpire", respData.data.expire);
            }
            return response;
          },
        },
      });
    },
  },
});
