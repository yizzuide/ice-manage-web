import { customRef } from "vue";

/**
 * 自定义节流/防抖的Ref
 * @param value 引用的值
 * @param onUpdate 更新时回调
 * @returns
 */
export default function (value: any, onUpdate?: () => void) {
  // customRef(收集依赖函数，触发更新依赖函数)
  return customRef((track, trigger) => {
    let timer: NodeJS.Timeout;
    return {
      // 调用.value时，收集依赖，返回值
      get() {
        track();
        return value;
      },
      set(newValue) {
        // 在持续设置值时，停止上次延时
        clearTimeout(timer);
        // 延时设置新值，并触发更新依赖
        timer = setTimeout(() => {
          value = newValue;
          trigger();
          if (onUpdate) onUpdate();
        }, 500);
      },
    };
  });
}
