import { defineStore } from "pinia";
import { Model } from "@/components/views/data-dialog";
import { HttpResult, PageData } from "@/http/HttpDefine";
import request from "@/http/uniformRequest";
import { Job } from "../config/ice-data-dialog";

export interface JobInspectInfo extends Model {
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
      jobInfoList: <JobInspectInfo[]>[],
      pageCount: 0,
      totalSize: 0,
    };
  },
  actions: {
    async fetchPage(params: any) {
      return request<PageData<JobInspectInfo>>({
        url: "/api/job/jobInfoList",
        params,
        showLoading: true,
      }).then((respData) => {
        const { pageCount, totalSize, list } = respData.data!;
        this.pageCount = pageCount;
        this.totalSize = totalSize;
        this.jobInfoList = list;
      });
    },
    async fetchJobDetail(jobId: string, topic: string) {
      return request<Job>({
        url: "/api/job/jobDetail",
        params: {
          jobId,
          topic,
        },
        showLoading: true,
      });
    },
  },
});
