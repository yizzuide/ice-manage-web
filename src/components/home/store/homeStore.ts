import { defineStore } from "pinia";
import useLocalStorage from "@/hooks/useLocalStorage";
import { RouteTagInfo } from "../types/route-info";

const localStorage = useLocalStorage();

export const useHomeStore = defineStore("home", {
  state: () => {
    return {
      selectedMenuIndex: (function () {
        const menuIndex = localStorage.get("menuIndex");
        return menuIndex ?? "/index/dashboard";
      })(),
      tagList: <RouteTagInfo[]>[
        {
          title: "首页",
          path: "/index/dashboard",
          active: true,
          closable: false,
        },
      ],
    };
  },
  getters: {},
  actions: {
    // 更新选择的菜单
    updateCacheMenuInfo() {
      localStorage.set("menuIndex", this.selectedMenuIndex);
    },

    // 添加或更新TagInfo
    addOrUpdateTagInfo(preRoutePath: string, tagInfo: RouteTagInfo) {
      const activePath = tagInfo.path;
      // 有查找到相应tag，直接返回
      if (this.activeRouteTagInfo(preRoutePath, activePath)) {
        return;
      }
      // 添加新的Tag
      this.tagList.push(tagInfo);
    },

    activeRouteTagInfo(preRoutePath: string, activePath: string): boolean {
      let findFlag = false;
      // 查找是否已添加，如果有就激活当前
      for (const tag of this.tagList) {
        if (tag.path == activePath) {
          tag.active = true;
          findFlag = true;
          break;
        }
      }
      // 上一个取消激活
      for (const preTag of this.tagList) {
        if (!preRoutePath) {
          preTag.active = false;
        }
        if (preTag.path == preRoutePath) {
          preTag.active = false;
          break;
        }
      }
      return findFlag;
    },
  },
});
