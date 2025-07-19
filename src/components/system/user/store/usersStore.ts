import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/UniformRequest";
import { ContentType } from "@/plugins/request";
import { defineStore } from "pinia";

export interface User {
  id: number;
  username: string;
  password: string;
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
      pageCount: 0,
      totalSize: 0,
      userList: <User[]>[],
      usersAllSource: <User[]>[],
    };
  },
  actions: {
    async fetchAll() {
      return request<User[]>({
        url: "/api/manage/user/all",
      }).then((respData) => (this.usersAllSource = respData.data!));
    },
    async fetchPage(pageData: QueryPageData<User>) {
      return request<PageData<User>>({
        url: "/api/manage/user/list",
        method: "post",
        contentType: ContentType.JSON,
        params: pageData,
        showLoading: true,
      }).then((respData) => {
        const { pageCount, totalSize, list } = respData.data!;
        this.pageCount = pageCount;
        this.totalSize = totalSize;
        this.userList = list;
      });
    },
    async findRoleIds(uid: number) {
      return request<number[]>({
        url: "/api/manage/user/find",
        params: {
          uid,
        },
        showLoading: true,
      }).then((respData) => respData.data!);
    },
    removeRecord(id: number) {
      return request({
        url: "/api/manage/user/del",
        method: "delete",
        params: {
          id,
        },
        showLoading: true,
      });
    },
    findUserById(id: number) {
      return this.userList.find((user) => user.id === id);
    },
  },
});
