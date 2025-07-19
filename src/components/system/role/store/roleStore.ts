import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/UniformRequest";
import { ContentType } from "@/plugins/request";
import { defineStore } from "pinia";

export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  remark: string;
  createUser: number;
  createTime: string;
}

export const useRoleStore = defineStore("role", {
  state: () => {
    return {
      pageCount: 0,
      totalSize: 0,
      roleList: <Role[]>[],
      rolesAllSource: <Role[]>[],
    };
  },
  actions: {
    async fetchPage(pageData: QueryPageData<Role>) {
      return request<PageData<Role>>({
        url: "/api/manage/role/list",
        method: "post",
        contentType: ContentType.JSON,
        params: pageData,
        showLoading: true,
      }).then((respData) => {
        const { pageCount, totalSize, list } = respData.data!;
        this.pageCount = pageCount;
        this.totalSize = totalSize;
        this.roleList = list;
      });
    },
    async fetchAll() {
      return request<Role[]>({
        url: "/api/manage/role/all",
      }).then((respData) => (this.rolesAllSource = respData.data!));
    },
    async findPermIds(roleId: number) {
      return request<number[]>({
        url: "/api/manage/role/find",
        params: {
          roleId,
        },
        showLoading: true,
      }).then((respData) => respData.data!);
    },
    removeRecord(id: number) {
      return request({
        url: "/api/manage/role/del",
        method: "delete",
        params: {
          id,
        },
        showLoading: true,
      });
    },
  },
});
