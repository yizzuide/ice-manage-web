import { Page } from "@/components/views/list-page";
import { JobInspectInfo } from "../store/iceStore";
import { formatTimestamp } from "@/directives/formatTime";
import { Ref } from "vue";

export function initPageData(
  iceListPage: Ref<Page<JobInspectInfo>>,
  topics: string[]
) {
  const searchItem = iceListPage.value.struct.search.items?.find(
    (item) => item.prop === "topic"
  );
  searchItem!.selectOptions = topics.map((tKey) => ({
    label: tKey,
    value: tKey,
  }));
}

export const iceListPage: Page<JobInspectInfo> = {
  type: "readonly",
  struct: {
    search: {
      items: [
        {
          type: "text",
          placeholder: "输入Job的id",
          prop: "id",
        },
        {
          type: "select",
          placeholder: "选择主题",
          prop: "topic",
          selectOptions: [],
        },
        {
          type: "select",
          placeholder: "选择时间排序",
          prop: "order",
          selectOptions: [
            {
              label: "升序",
              value: 1,
            },
            {
              label: "降序",
              value: -1,
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
          slotName: "needRePushColumn",
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
