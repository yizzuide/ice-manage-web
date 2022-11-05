import { Page } from "@/components/views/list-page";
import { JobInfo } from "../store/iceStore";

export const iceListPage: Page<JobInfo> = {
  type: "readonly",
  struct: {
    search: {
      firstInput: {
        placeholder: "请输入Job的id",
      },
    },
    table: {
      items: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "topic",
          label: "主题",
          width: 120,
        },
        {
          prop: "applicationName",
          label: "应用名",
          width: 150,
        },
        {
          prop: "queueType",
          label: "队列类型",
          width: 120,
        },
        {
          prop: "bucketIndex",
          label: "延迟桶位置",
          width: 120,
          format: (row: JobInfo) => {
            if (row.bucketIndex == -1) {
              return "无";
            }
            return `${row.bucketIndex}`;
          },
        },
        {
          prop: "executionTime",
          label: "下次执行时间",
          width: 150,
          format: (row: JobInfo) => {
            if (row.bucketIndex == -1) {
              return "无";
            }
            return `${row.bucketIndex}`;
          },
        },
        {
          prop: "hadRetryCount",
          label: "已重试次数",
          width: 100,
        },
        {
          prop: "needRePush",
          label: "可否重推",
          width: 80,
        },
        {
          prop: "pushTime",
          label: "推送时间",
          width: 150,
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: 150,
        },
      ],
    },
  },
};
