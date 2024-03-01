import {App} from "vue";
import focusDirective from "./focus";
import formatTimeDirective from "./formatTime";
import horizontalScrollDirective from "./horizontalScroll";
import mediaMatchDirective from "./mediaMatch";

/**
 * 添加全局自定义指令
 * @param app app对象
 */
export default function registerDirectives(app: App<Element>) {
  // v-focus（对象导出方式）
  const {name: focusName, vFocus} = focusDirective();
  // v-format-time（元组方式）
  const [formatTimeName, vFormatTime] = formatTimeDirective();
  const [horizontalScrollName, vHorizontalScroll] = horizontalScrollDirective();
  const [mediaMatchName, vMediaMatch] = mediaMatchDirective();

  app.directive(focusName, vFocus);
  app.directive(formatTimeName, vFormatTime);
  app.directive(horizontalScrollName, vHorizontalScroll);
  app.directive(mediaMatchName, vMediaMatch);
}
