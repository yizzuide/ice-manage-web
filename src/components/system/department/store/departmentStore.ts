import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import { buildProxyNodeTree, Node } from "@/tools/nodeTree";
import { defineStore } from "pinia";

export interface Department extends Node {
  id: number;
  pid: number;
  departmentName: string;
  phone: string;
  address: string;
  createTime: string;
  orderNum: number;
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
        // 构建树节点列表
        this.departmentList = buildProxyNodeTree(
          respData.data!.list,
          (target) => {
            return {
              getId() {
                return target.id;
              },
              getParentId() {
                return target.pid;
              },
              getOrder() {
                return target.orderNum;
              },
              setChildren(parentNode, nodes) {
                const depart = parentNode as Department;
                depart.children = nodes as Department[];
              },
            };
          }
        );
      });
    },
  },
});
