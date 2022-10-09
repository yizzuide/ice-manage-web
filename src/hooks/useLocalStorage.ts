import {Ref, ref, watch} from "vue";

class LocalCache {
  set(key: string, value?: any | Ref) {
    const data = ref(value);
    if (value) {
      window.localStorage.setItem(key, JSON.stringify(data.value));
    }
  }

  get(key: string) {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  getRef(key: string) {
    const value = window.localStorage.getItem(key);
    const data = ref();
    if (value) {
      data.value = JSON.parse(value);
    }
    watch(data, () => {
      console.log("update store: ", data.value);
      window.localStorage.setItem(key, JSON.stringify(data.value));
    });
    return data;
  }

  remove(key: string) {
    window.localStorage.removeItem(key);
  }
}

export default function () {
  return new LocalCache();
}
