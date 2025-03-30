import { defineStore } from "pinia";
import { ContentType } from "@/plugins/request";
import useLocalStorage from "@/hooks/useLocalStorage";
import request, { cachedRequest } from "@/http/uniformRequest";
import { DynamicMenu } from "@/tools/dynamicRoutes";

export interface UserInfo {
  uid: number;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  department: string;
  isAdmin: boolean;
  perms: string[];
}

export interface Menu extends DynamicMenu {
  id: number;
  name: string;
  icon?: string;
  routeName: string;
  routePath: string;
  componentPath: string;
  children?: Menu[];
  order: number;
}

const localStorage = useLocalStorage();
export default defineStore("user", {
  state: () => {
    return {
      // 使用立即执行函数初始化
      userInfo: (function () {
        // 从缓存加载
        const cachedUserInfo = localStorage.get("userInfo");
        return cachedUserInfo ? (cachedUserInfo as UserInfo) : <UserInfo>{};
      })(),
      menuList: (function () {
        const cachedMenus = localStorage.get("menuList");
        return cachedMenus ? (cachedMenus as Menu[]) : <Menu[]>{};
      })(),
    };
  },
  getters: {},
  actions: {
    async fetchMenuList(loading: boolean) {
      return cachedRequest<Menu[]>({
        requestConfig: {
          url: "/api/manage/user/menu",
          method: "get",
          showLoading: loading,
        },
        cachedName: "menuList",
        beforeCache: (data) => {
          this.menuList = data;
          // 添加首页数据面板菜单
          this.menuList?.unshift({
            id: -1,
            name: "首页",
            icon: "Odometer",
            routeName: "dashboard",
            routePath: "/index/dashboard",
            componentPath: "/home/DashboardPage",
            // API返回的菜单列表第一个从0开始
            order: -1,
          } as Menu);
          // 更新菜单排序值
          for (const menu of this.menuList) {
            menu.order = menu.order + 1;
          }
        },
      });
    },
    async fetchUserInfo(loading: boolean) {
      return cachedRequest<UserInfo>({
        requestConfig: {
          url: "/api/manage/user/info",
          method: "get",
          showLoading: loading,
        },
        cachedName: "userInfo",
        beforeCache: (data) => {
          this.userInfo = data;
        },
      });
    },
    async accountLogin(username: string, password: string, code: string, uuid: string) {
      return cachedRequest<any>({
        requestConfig: {
          url: "/api/login",
          params: {
            username,
            password,
            code,
            uuid,
          },
          method: "post",
          contentType: ContentType.FORM,
          showLoading: true,
        },
        cachedName: "token,tokenExpire",
        beforeCache: (data) => [data.token, data.expire],
      });
    },
    logout() {
      return request({
        url: "/api/logout",
        method: "get",
        showLoading: true,
      });
    },
  },
});
