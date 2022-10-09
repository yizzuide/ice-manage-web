import {Directive, DirectiveBinding, VNode, VueElement} from "vue";

/**
 * 自定义指令v-focus
 * @returns 指令实现
 */
export default function () {
  // 定义指令名
  const name = "focus";
  const vFocus: Directive<VueElement, string> = {
    created: (
      el: VueElement,
      bindings: DirectiveBinding<string>,
      vNode: VNode<any, VueElement>,
      preVNode: null
    ) => console.log("focus created!"),
    beforeUpdate: (
      el: VueElement,
      bindings: DirectiveBinding<string>,
      vNode: VNode<any, VueElement>,
      preVNode: VNode<any, VueElement>
    ) => {
    },
    mounted: (el: VueElement) => el.focus(),
  };
  return {
    name,
    vFocus,
  };
}
