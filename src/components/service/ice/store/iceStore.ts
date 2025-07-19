import { PageData } from "@/http/HttpDefine";
import request from "@/http/UniformRequest";
import { ContentType } from "@/plugins/request";
import { defineStore } from "pinia";
import { Job } from "../config/ice-data-dialog";

export interface JobInspectInfo {
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
        url: "/api/job/jobInspectInfos",
        params,
        showLoading: true,
      }).then((respData) => {
        const { pageCount, totalSize, list } = respData.data!;
        this.pageCount = pageCount;
        this.totalSize = totalSize;
        this.jobInfoList = list;
        // 返回响应数据给调用方
        return respData;
      });
    },
    fetchJobDetail(jobId: string, topic: string) {
      return request<Job>({
        url: "/api/job/jobDetail",
        params: {
          jobId,
          topic,
        },
        showLoading: true,
      });
    },
    rePushJob(jobId: string, topic: string) {
      return request<unknown>({
        url: "/api/job/rePush",
        method: "put",
        contentType: ContentType.FORM,
        params: {
          jobId,
          topic,
        },
        showLoading: true,
      });
    },
  },
});
