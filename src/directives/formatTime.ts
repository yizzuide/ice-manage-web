import { Directive, DirectiveBinding, VueElement } from "vue";
import dayjs from "dayjs";
import { DirectiveTuple } from "./tuple";

export default function (): DirectiveTuple<string> {
  // 定义指令名
  const name = "format-time";

  const vFormatTime: Directive<VueElement, string> = {
    mounted: (el: VueElement, bindings: DirectiveBinding<string>) => {
      const content = el.textContent;
      if (content == null) return "";
      // 是否有自定义pattern值
      const pattern = bindings.value ?? undefined;
      el.textContent = formatTimestamp(content, pattern);
    },
  };
  return [name, vFormatTime];
}

export function formatTimestamp(time: string | number, pattern?: string) {
  if (time == null) return "";
  // 转为数字
  let timestamp = (
    typeof time === "string" ? parseInt(time as string) : time
  ) as number;
  // 如果为秒，转为毫秒
  if (`${time}`.length === 10) {
    timestamp = timestamp * 1000;
  }
  pattern = pattern ?? "YYYY-MM-DD HH:mm:ss";
  return dayjs(timestamp).format(pattern);
}
