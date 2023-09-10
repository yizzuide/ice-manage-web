import { createApp } from "vue";
import App from "./App.vue";

import "animate.css";
import "gsap";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import Colada, { PiniaColadaPlugin } from "colada-plugin";
import router from "./router";
import registerDirectives from "./directives";
import EventBus from "./plugins/EventBus";
import { Request } from "./http/Request";
import { NamedIcon } from "./plugins/NamedIcon";

// 导入全局样式
import "./styles/global.scss";
import define from "./styles/define.module.scss";
// 主题工具
import { changeTheme } from "./tools/eleTheme";

const app = createApp(App);

// 注册自定义指令
registerDirectives(app);

const pinia = createPinia();
// pinia timeline plugin (Vue Dev)
pinia.use(PiniaColadaPlugin);
// pinia persisted in state -> persist: true,
pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(pinia);
app.use(Colada);
app.use(EventBus);
app.use(Request);
app.use(NamedIcon);

app.mount("#app");

// 修改主题色
changeTheme(define.primaryColor);

window.onerror = function(message, source, lineno, colno, error) {
  console.log(`Run error with msg: ${message}, source file: ${source}, line number: ${lineno}`);
};
