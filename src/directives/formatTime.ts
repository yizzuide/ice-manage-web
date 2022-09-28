import { Directive, DirectiveBinding, VueElement } from "vue";
import dayjs from "dayjs";
import { DirectiveTuple } from "./tuple";

export default function (): DirectiveTuple<string> {
  // 定义指令名
  const name = "format-time";

  const vFormatTime: Directive<VueElement, string> = {
    mounted: (el: VueElement, bindings: DirectiveBinding<string>) => {
      const content = el.textContent;
      if (content == null) return;
      // 转为数字
      let timestamp = parseInt(content);
      // 如果为秒，转为毫秒
      if (content.length === 10) {
        timestamp = timestamp * 1000;
      }
      let pattern = "YYYY-MM-DD HH:mm:ss";
      // 是否有自定义pattern值
      if (bindings.value) {
        pattern = bindings.value;
      }
      el.textContent = dayjs(timestamp).format(pattern);
    },
  };
  return [name, vFormatTime];
}
