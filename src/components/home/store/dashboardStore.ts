import request from "@/http/uniformRequest";
import { defineStore } from "pinia";

export type KVItem = { name: string; value: number };

export interface JobStatInfo {
  total: number;
  finishTotal: number;
  todayCount: number;
  finishTodayCount: number;
  topics: KVItem;
  delayBuckets: KVItem;
  jobPoolCount: number;
  readyQueueCount: number;
  deadQueueCount: number;
  successDaysCount: KVItem;
  failDaysCount: KVItem;
}

export const useDashboardStore = defineStore("dashboard", {
  state: () => {
    return {
      jobStatInfo: <JobStatInfo>{},
    };
  },
  actions: {
    async fetchJobStatInfo() {
      return new Promise((resolve, reject) => {
        // 模拟延时
        setTimeout(() => {
          request<JobStatInfo>({
            url: "/api/job/getJobStat",
            method: "get",
          }).then((respData) => {
            if (respData.code == 0) {
              this.jobStatInfo = respData.data!;
            }
            resolve(respData);
          });
        }, 200);
      });
    },
  },
});
