import { Page } from "@/components/views/list-page";
import { JobInspectInfo } from "../store/iceStore";
import { formatTimestamp } from "@/directives/formatTime";

export const iceListPage: Page<JobInspectInfo> = {
  type: "readonly",
  struct: {
    search: {
      items: [
        {
          type: "text",
          placeholder: "输入Job的id",
        },
        {
          type: "select",
          placeholder: "请选择主题",
          selectOptions: [
            {
              label: "check_order",
              value: 0,
            },
            {
              label: "audit_order",
              value: 1,
            },
          ],
        },
      ],
    },
    table: {
      items: [
        {
          prop: "id",
          label: "ID",
        },
        {
          prop: "topic",
          label: "主题[Topic]",
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
          format: (row: JobInspectInfo) =>
            row.bucketIndex == -1 ? "无" : `${row.bucketIndex}`,
        },
        {
          prop: "executionTime",
          label: "下次执行时间",
          width: 150,
          format: (row: JobInspectInfo) =>
            row.executionTime == -1 ? "无" : formatTimestamp(row.executionTime),
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
          format: (row: JobInspectInfo) => formatTimestamp(row.pushTime),
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: 150,
          format: (row: JobInspectInfo) => formatTimestamp(row.updateTime),
        },
      ],
    },
  },
};
