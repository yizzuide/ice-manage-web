import { App, createVNode } from "vue";
import * as Icons from "@element-plus/icons-vue";

// 使用方式：<named-icon :icon="xxx"></named-icon>
function NamedIconComponent(props: { icon: string }) {
  const { icon } = props;
  // keyof: 获取类型的所有键的联合类型
  // icon as keyof typeof object: 将icon转为可识别的键类型
  return createVNode(Icons[icon as keyof typeof Icons]);
}

export function NamedIcon(app: App<Element>) {
  app.component("NamedIcon", NamedIconComponent);
}
