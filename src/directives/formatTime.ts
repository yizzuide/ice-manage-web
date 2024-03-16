import { Directive, DirectiveBinding, VueElement } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import { DirectiveTuple } from "./tuple";

// dayjs支持utc格式
dayjs.extend(utc);
dayjs.extend(duration);

export const DEFAULT_PATTERN = "YYYY-MM-DD HH:mm:ss";

export const DATE_PATTERN = "YYYY-MM-DD";

const UTC_REG = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/;

export default function (): DirectiveTuple<string> {
  // 定义指令名
  const name = "format-time";

  const vFormatTime: Directive<VueElement, string> = {
    mounted: (el: VueElement, bindings: DirectiveBinding<string>) => {
      const content = el.textContent;
      if (content == null) return "";
      // 是否有自定义pattern值
      const pattern = bindings.value ?? undefined;
      el.textContent = UTC_REG.test(content)
        ? formatUtc(content, pattern)
        : formatTimestamp(content, pattern);
    },
  };
  return [name, vFormatTime];
}

export function formatUtc(time: string, pattern?: string) {
  return dayjs.utc(time).format(pattern);
}

export function formatTimestamp(time: string | number, pattern?: string) {
  if (time == null) return "";
  //已经格式化
  if(time.toString().indexOf("-") != -1)  return time.toString();
  // 转为数字
  let timestamp = (
    typeof time === "string" ? parseInt(time as string) : time
  ) as number;
  // 如果为unix时间戳，转为毫秒时间戳
  if (`${time}`.length === 10) {
    timestamp = timestamp * 1000;
  }
  pattern = pattern ?? DEFAULT_PATTERN;
  return dayjs(timestamp).format(pattern);
}

export function formatDuration(time: string | number) {
  if (!time || time === "") {
    return "";
  }
  const startTime = dayjs(time);
  const now = dayjs();
  const duration = dayjs.duration(now.diff(startTime));
  return duration.format("D[天]H[小时]m[分钟]s[秒]").replace(/^0天|0小时|0分/, "").replace(/^0小时|0分/, "").replace(/^0分/, "");
}

export function unix2Mills(unixTime: number) {
  if (`${unixTime}`.length === 10)
    return unixTime * 1000;
  return unixTime;
}

export function mills2Unix(millsTime: number) {
  if(millsTime) {
    if (millsTime.toString().length > 10)
      return Math.floor(millsTime / 1000);
    return millsTime;
  }
}
