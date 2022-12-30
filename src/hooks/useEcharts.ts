import * as echarts from "echarts";

export default function (el: HTMLElement) {
  const echartsInstance = echarts.init(
    el,
    /* "light" */ undefined, // 主题
    { renderer: "svg" } // 渲染引擎，小数据svg性能更高（特别是在移动端）
  );
  const setOptions = (options: echarts.EChartsOption) => {
    echartsInstance.setOption(options);
  };
  const resize = () => {
    echartsInstance.resize();
  };
  // 调整窗口时，重置echarts大小
  window.addEventListener("resize", () => resize());
  return {
    echartsInstance,
    setOptions,
    resize,
  };
}
