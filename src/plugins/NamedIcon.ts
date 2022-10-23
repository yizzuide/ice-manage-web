import { App, createVNode } from "vue";
import * as Icons from "@element-plus/icons-vue";

// <named-icon :icon="xxx"></named-icon>
function NamedIconComponent(props: { icon: string }) {
  const { icon } = props;
  return createVNode(Icons[icon as keyof typeof Icons]);
}

export function NamedIcon(app: App<Element>) {
  app.component("NamedIcon", NamedIconComponent);
}
