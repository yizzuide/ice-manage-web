import { getCurrentInstance } from "vue";
import { Axios } from "./axios";

export default function (): Axios {
  return getCurrentInstance()?.appContext.config.globalProperties.$http;
}
