import { App } from "vue";
import axios from "axios";

export default function (app: App<Element>) {
  app.config.globalProperties.$http = axios;
}
