import { App } from "vue";
import { EventBus, CallBack } from "./event-bus";

class Emitter implements EventBus {
  // <eventName, callback[]>
  private static readonly handlerMap: Map<string, Array<CallBack>> = new Map();

  on(key: string, callback: CallBack): void {
    let fns = Emitter.handlerMap.get(key);
    if (fns) {
      fns = [];
      fns.push(callback);
      Emitter.handlerMap.set(key, fns);
      return;
    }
    fns = [callback];
    Emitter.handlerMap.set(key, fns);
  }

  emit(key: string, ...args: any[]): void {
    Emitter.handlerMap.get(key)?.forEach((fn) => (args ? fn(...args) : fn()));
  }
}

// 安装插件：vue会通过调用对象install方法或函数安装插件
export default function (app: App<Element>) {
  // 注册全局变量，一般用$开头
  //app.config.globalProperties.$eventBus = emitter()
  app.config.globalProperties.$eventBus = new Emitter();
}
