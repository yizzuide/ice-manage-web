import { ElLoading } from "element-plus";

export default function(callback: () => any, msg?: string, waitMills: number = 3000) {
  const loading = ElLoading.service({
    lock: true,
    text: msg ?? "请求加载中...",
    background: "rgba(0, 0, 0, 0.1)",
  });
  setTimeout(() => {
    loading?.close();
    callback();
  }, waitMills);

}
