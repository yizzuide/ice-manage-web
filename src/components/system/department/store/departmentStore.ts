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
        const departmentList = respData.data!.list;
        // 构建树节点列表
        const departmentNodeTree = buildProxyNodeTree(
          departmentList,
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
          },
          0
        );

        // 查找单个且没有父节点关联的（不需要构建节点树）
        const singleNodeList = departmentList
          .filter((n) => {
            for (const pn of departmentList) {
              if (n.pid == pn.id) {
                return false;
              }
            }
            return true;
          })
          .filter((n) => n.pid != 0);
        this.departmentList = [...departmentNodeTree, ...singleNodeList];
        console.log("data: ", this.departmentList);
      });
    },
  },
});
