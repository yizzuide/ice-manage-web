import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import { buildProxyNodeTree, Node } from "@/tools/nodeTree";
import { defineStore } from "pinia";

export interface Department extends Node {
  id: number;
  pid: number;
  parentName: string;
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
      pageCount: 0,
      totalSize: 0,
      departmentList: <Department[]>[],
      departmentAllSource: <Department[]>[],
      departmentAllTree: <Department[]>[],
    };
  },
  actions: {
    async fetchPage(pageData: QueryPageData<Department>) {
      return request<PageData<Department>>({
        url: "/api/manage/department/list",
        method: "get",
        params: pageData,
        showLoading: true,
      }).then((respData) => {
        this.pageCount = respData.data!.pageCount;
        this.totalSize = respData.data!.totalSize;
        // 构建树节点列表
        this.departmentList = buildDepartmentTree(respData.data!.list);
      });
    },
    fetchAll() {
      return request<Department[]>({
        url: "/api/manage/department/all",
        method: "get",
        showLoading: true,
      }).then((respData) => {
        this.departmentAllSource = [...respData.data!];
        this.departmentAllTree = buildDepartmentTree(respData.data!);
      });
    },
    removeRecord(id: number) {
      return request({
        url: "/api/manage/department/del",
        method: "delete",
        params: {
          id,
        },
        showLoading: true,
      });
    },
    findDepartmentNameById(id: number) {
      return this.departmentAllSource.find((depart) => depart.id == id)
        ?.departmentName;
    },
  },
});

function buildDepartmentTree(list: Department[]) {
  return buildProxyNodeTree(list, (target) => {
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
  });
}
