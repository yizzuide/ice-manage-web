import { Model } from "@/components/views/data-dialog";
import { PageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import { defineStore } from "pinia";

export interface JobInfo extends Model {
  id: string;
  topic: string;
  applicationName: string;
  queueType: string;
  bucketIndex: number;
  executionTime: number;
  hadRetryCount: number;
  needRePush: boolean;
  pushTime: number;
  updateTime: number;
}

export const useIceStore = defineStore("ice", {
  state: () => {
    return {
      jobInfoList: <JobInfo[]>[],
      pageCount: 0,
      totalSize: 0,
    };
  },
  actions: {
    async fetchPage(params: any) {
      return request<PageData<JobInfo>>({
        url: "/api/job/jobInfoList",
        params,
        showLoading: true,
      }).then((respData) => {
        this.pageCount = respData.data!.pageCount;
        this.totalSize = respData.data!.totalSize;
        this.jobInfoList = respData.data!.list;
      });
    },
  },
});
