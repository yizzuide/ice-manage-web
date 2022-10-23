import { defineStore } from "pinia";
import { ContentType } from "@/plugins/request";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cachedRequest } from "@/http/uniformRequest";

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
      return cachedRequest<Menu[]>(
        {
          url: "/api/manage/user/menu",
          method: "get",
          showLoading: loading,
        },
        "menuList",
        (data) => {
          this.menuList = data;
          // 添加工作台菜单
          this.menuList?.unshift({
            name: "工作台",
            routeName: "workbench",
            routePath: "/home/workbench",
            componentPath: "/home/WorkbenchPage.vue",
          });
        }
      );
    },
    async fetchUserInfo(loading: boolean) {
      return cachedRequest<UserInfo>(
        {
          url: "/api/manage/user/info",
          method: "get",
          showLoading: loading,
        },
        "userInfo",
        (data) => {
          this.userInfo = data;
        }
      );
    },
    async accountLogin(username: string, password: string, code: string) {
      return cachedRequest<any>(
        {
          url: "/api/login",
          params: {
            username,
            password,
            code,
          },
          method: "post",
          contentType: ContentType.FORM,
          showLoading: true,
        },
        "token,tokenExpire",
        (data) => [data.token, data.expire]
      );
    },
  },
});
