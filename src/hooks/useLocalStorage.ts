import { Ref, ref, watch } from "vue";

/**
 * 缓存数据
 * @param key 存储的key
 * @param value 存储的值（支持对象与Ref）
 * @returns 存储值的Ref
 */
export default function (key: string, value?: object | Ref<object>) {
  const data = ref(value);
  // 设置值：fn(key, value)
  if (value) {
    window.localStorage.setItem(key, JSON.stringify(data.value));
  } else {
    // 获取值: fn(key)
    data.value = window.localStorage.getItem(key) as any;
  }
  watch(data, () => {
    console.log("update store: ", data.value);
    window.localStorage.setItem(key, JSON.stringify(data.value));
  });
  return data;
}
