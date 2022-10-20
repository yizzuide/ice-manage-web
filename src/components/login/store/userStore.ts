import { defineStore } from "pinia";
import { ContentType } from "@/plugins/request";
import useLocalStorage from "@/hooks/useLocalStorage";
import request from "@/http/UniformRequest";

export default defineStore("user", {
  state: () => {
    return {
      name: "",
    };
  },
  getters: {},
  actions: {
    async accountLogin(username: string, password: string, code: string) {
      return request<any>({
        url: "/api/login",
        params: {
          username,
          password,
          code,
        },
        method: "post",
        contentType: ContentType.FORM,
        showLoading: true,
        interceptor: {
          // 响应数据时，缓存token
          onResponse(response) {
            const respData = response.data;
            if (respData.code == 0) {
              const localStorage = useLocalStorage();
              localStorage.set("token", respData.data.token);
              localStorage.set("tokenExpire", respData.data.expire);
            }
            return response;
          },
        },
      });
    },
  },
});
