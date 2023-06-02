import { getCurrentInstance } from "vue";
import { EventBus } from "../plugins/event-bus";

export default function (): EventBus {
  let result =
    getCurrentInstance()?.appContext.config.globalProperties.$eventBus;
  if (!result) {
    result = getCurrentInstance()?.proxy?.$eventBus;
  }
  return result!;
}
