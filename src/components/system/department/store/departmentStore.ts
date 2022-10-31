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
        // 使用代理实现nodeTree需要的接口方法
        const proxyNodeList = respData.data!.list.map((d) =>
          proxyImplNode(d, {
            getId() {
              return d.id;
            },
            getParentId() {
              return d.pid;
            },
            getOrder() {
              return d.orderNum;
            },
            setChildren(parentNode, nodes) {
              const depart = parentNode as Department;
              depart.children = nodes as Department[];
            },
          })
        );
        // 查找单个且没有父节点关联的（不需要构建节点树）
        const singleNodeList = proxyNodeList
          .filter((n) => {
            for (const pn of proxyNodeList) {
              if (n.target.pid == pn.target.id) {
                return false;
              }
            }
            return true;
          })
          .filter((n) => n.target.pid != 0);
        this.departmentList = [
          ...buildTree(proxyNodeList, 0),
          ...singleNodeList.map((n) => n.target),
        ];
        console.log("data: ", this.departmentList);
      });
    },
  },
});
