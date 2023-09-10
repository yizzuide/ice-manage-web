import { Model } from "@/components/views/data-dialog";
import { PageData, QueryPageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import { ContentType } from "@/plugins/request";
import { defineStore } from "pinia";

export interface ProxyStoreConfig {
  // Pinia store name
  name: string;
  // 请求模块名（如果设置，优选取这个）
  moduleName?: string;
  // 根据id查找name的字段名
  findNameField?: string;
  // 自定义请求URL
  urls?: {
    findPage?: string,
    findAll?: string,
    delete?: string
  };
  // 自定义getter方法
  getters?: () => any;
  // 自定义请求方法
  actions?: () => any;
}

export function extendAction<T>(store: any) {
  return store as T;
}

export default function usePiniaStore<T extends Model>(config: ProxyStoreConfig) {
  return defineStore(`${config.name}Store`, {
    state: () => {
      return {
        pageCount: 0,
        totalSize: 0,
        list: [<T>{}],
        allList: [<T>{}],
      };
    },
    getters: {
      ...config.getters
    },
    actions: {
      async fetchPage(pageData: QueryPageData<T>) {
        return request<PageData<T>>({
          url: config.urls?.findPage || `/api/manage/${config.moduleName || config.name}/list`,
          method: "post",
          contentType: ContentType.JSON,
          params: pageData,
          showLoading: true,
        }).then((respData) => {
          const { pageCount, totalSize, list } = respData.data!;
          this.pageCount = pageCount;
          this.totalSize = totalSize;
          this.list = list as any;
        });
      },
      async fetchAll() {
        return request<T[]>({
          url: config.urls?.findAll || `/api/manage/${config.moduleName || config.name}/all`,
          method: "get",
          showLoading: false,
        }).then((respData) => {
          this.allList = [...respData.data!] as any;
        });
      },
      removeRecord(id: number) {
        return request({
          url: config.urls?.delete || `/api/manage/${config.moduleName || config.name}/del`,
          method: "delete",
          params: {
            id,
          },
          showLoading: true,
        });
      },
      findNameById(id: number) {
        return this.allList.find(item => item.id === id)?.[config.findNameField!] || "";
      },
      ...config.actions
    }
  });
}
