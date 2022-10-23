import { createApp } from "vue";
import App from "./App.vue";

import "animate.css";
import "gsap";
import { createPinia } from "pinia";
import router from "./router";
import registerDirectives from "./directives";
import EventBus from "./plugins/EventBus";
import { Request } from "./http/Request";
import { NamedIcon } from "./plugins/NamedIcon";

// 导入全局样式
import "./styles/global.scss";
import define from "./styles/define.module.scss";

import { changeTheme, EleTheme } from "./tools/eleTheme";

const app = createApp(App);

registerDirectives(app);

app.use(router);
app.use(createPinia());
app.use(EventBus);
app.use(Request);
app.use(NamedIcon);

app.mount("#app");

// 修改主题色
changeTheme(define.primaryColor);
