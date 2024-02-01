import { Directive, DirectiveBinding, VueElement } from "vue";
import { DirectiveTuple } from "./tuple";

export default function (): DirectiveTuple<string> {
  const name = "horizontal-scroll";

  const vHorizontalScroll: Directive<VueElement, string> = {
    mounted: (el: VueElement, bindings: DirectiveBinding<string>) => {
      el.addEventListener("wheel", function (event) {
        // 阻止默认事件触发
        event.preventDefault();
        // 元素随鼠标横向滚动
        el.scrollLeft += event.deltaY;
      });
    },
  };
  return [name, vHorizontalScroll];
}
