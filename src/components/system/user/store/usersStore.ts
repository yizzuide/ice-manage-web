import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import { defineStore } from "pinia";

export interface User {
  id: number;
  username: string;
  realName: string;
  nickName: string;
  gender: number;
  departmentId: number;
  departmentName: string;
  phone: string;
  email: string;
  isAdmin: number;
  isEnabled: boolean;
  createTime: string;
}

export const useUsersStore = defineStore("users", {
  state: () => {
    return {
      userList: <User[]>[],
      pageCount: 0,
      totalSize: 0,
    };
  },
  actions: {
    async fetchPage(pageData: QueryPageData<User>) {
      return request<PageData<User>>({
        url: "/api/manage/user/list",
        method: "get",
        params: pageData,
        showLoading: true,
      }).then((respData) => {
        const { pageCount, totalSize, list } = respData.data!;
        this.pageCount = pageCount;
        this.totalSize = totalSize;
        this.userList = list;
      });
    },
  },
});
