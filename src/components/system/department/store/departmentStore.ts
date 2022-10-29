import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import { defineStore } from "pinia";

export interface Department {
  id: number;
  departmentName: string;
  phone: string;
  address: string;
  createTime: string;
  hasChildren?: boolean;
  children?: Department[];
}

export const useDepartmentStore = defineStore("department", {
  state: () => {
    return {
      departmentList: <Department[]>[],
    };
  },
  actions: {
    async fetchPage(pageData: QueryPageData<Department>) {
      return request<PageData<Department>>({
        url: "/api/department/list",
        method: "get",
        params: pageData,
        showLoading: true,
      }).then((respData) => {
        this.departmentList = respData.data!.list;
        console.log("data", respData);
      });
    },
  },
});
