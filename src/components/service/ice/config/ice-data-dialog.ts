import { DialogConfig } from "@/components/views/data-dialog";

export interface Job {
  id: string;
  topic: string;
  delay: number;
  ttr: number;
  retryCount: number;
  body: string;
}

export const icePushDataDialog: DialogConfig<Job> = {
  title: "推送延迟任务",
  request: {
    url: "",
    method: "post",
  },
  model: <Job>{},
  rules: {
    id: [
      {
        required: true,
        message: "id不能为空！",
        trigger: "blur",
      },
    ],
    topic: [
      {
        required: true,
        message: "主题不能为空！",
        trigger: "blur",
      },
    ],
    delay: [
      {
        required: true,
        message: "延时不能为空！",
        trigger: "blur",
      },
    ],
    body: [
      {
        required: true,
        message: "业务数据不能为空！",
        trigger: "blur",
      },
    ],
    retryCount: [
      {
        pattern: /\d+/,
        message: "重试次数必须为数字！",
        trigger: "blur",
      },
    ],
  },
  board: [
    {
      label: "任务ID",
      fieldName: "id",
    },
    {
      label: "主题",
      fieldName: "topic",
    },
    {
      type: "number",
      numberUsedMill: true,
      numberMin: 10000,
      label: "延时（ms）",
      fieldName: "delay",
    },
    {
      type: "number",
      numberUsedMill: true,
      numberMin: 10000,
      label: "消费超时（ms）",
      fieldName: "ttr",
    },
    {
      type: "number",
      label: "重试次数",
      fieldName: "retryCount",
    },
    {
      multiLine: true,
      label: "业务数据（json）",
      fieldName: "body",
      format: (value) => {
        value &&= (value as string).trim();
        if (value) {
          return JSON.parse(value as string);
        }
        return value;
      },
    },
  ],
};
