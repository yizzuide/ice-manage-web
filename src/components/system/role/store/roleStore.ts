import request from "@/http/uniformRequest";
import { defineStore } from "pinia";

export interface Role {
  id: number;
  roleCode: string;
  roleName: string;
  createUser: string;
  createTime: string;
}

export const useRoleStore = defineStore("role", {
  state: () => {
    return {
      rolesAllSource: <Role[]>[],
    };
  },
  actions: {
    async fetchAll() {
      return request<Role[]>({
        url: "/api/manage/role/all",
      }).then((respData) => (this.rolesAllSource = respData.data!));
    },
    async findRoleIds(uid: number) {
      return request<number[]>({
        url: "/api/manage/role/find",
        params: {
          uid,
        },
        showLoading: true,
      }).then((respData) => respData.data!);
    },
  },
});
