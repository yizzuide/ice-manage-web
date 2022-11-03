import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import { buildProxyNodeTree, Node } from "@/tools/nodeTree";
import { defineStore } from "pinia";

export interface Menu extends Node {
  id: number;
  label: string;
  icon: string;
  code: string;
  // 0 is menu directory, 1 is menu, 2 is button action
  type: number;
  routePath: string;
  routeName: string;
  componentPath: string;
  order: number;
  parentId?: number;
  parentName?: string;
  children?: Menu[];
}

export const useMenuStore = defineStore("menu", {
  state: () => {
    return {
      menuList: <Menu[]>[],
      pageCount: 0,
      totalSize: 0,
    };
  },
  actions: {
    async fetchPage(pageData: QueryPageData<Menu>) {
      return request<PageData<Menu>>({
        url: "/api/menu/list",
        method: "get",
        params: pageData,
        showLoading: true,
      }).then((respData) => {
        this.pageCount = respData.data!.pageCount;
        this.totalSize = respData.data!.totalSize;
        // 构建树节点列表
        this.menuList = buildProxyNodeTree(respData.data!.list, (target) => {
          return {
            getId() {
              return target.id;
            },
            getParentId() {
              return target.parentId!;
            },
            getOrder() {
              return target.order;
            },
            setChildren(parentNode, nodes) {
              const menu = parentNode as Menu;
              menu.children = nodes as Menu[];
            },
          };
        });
      });
    },
  },
});
