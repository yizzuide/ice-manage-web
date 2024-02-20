import { Directive, DirectiveBinding, VueElement } from "vue";
import { DirectiveTuple } from "@/directives/tuple";
import usePermission from "../hooks/usePermission";

export default function (): DirectiveTuple<string> {
  const name = "permission";

  const vPermission: Directive<VueElement, string> = {
    mounted: (el: VueElement, bindings: DirectiveBinding<string>) => {
      const hasPermission = usePermission().test(bindings.value);
      if (!hasPermission) {
        el.remove();
      }
    },
  };
  return [name, vPermission];
}
