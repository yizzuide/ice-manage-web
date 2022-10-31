import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import buildTree, { Node, proxyImplNode } from "@/tools/nodeTree";
import { defineStore } from "pinia";

export interface Department extends Node {
  id: number;
  pid: number;
  departmentName: string;
  phone: string;
  address: string;
  createTime: string;
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
        this.departmentList = buildTree(
          respData.data!.list.map((d) =>
            proxyImplNode(d, {
              getId() {
                return d.id;
              },
              getParentId() {
                return d.pid;
              },
              getOrder() {
                return 0;
              },
              setChildren(parentNode, nodes) {
                const depart = parentNode as Department;
                depart.children = nodes as Department[];
              },
            })
          ),
          0
        );
      });
    },
  },
});
