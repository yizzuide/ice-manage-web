import { defineStore } from "pinia";
import { ContentType } from "@/plugins/request";
import useLocalStorage from "@/hooks/useLocalStorage";
import request from "@/http/UniformRequest";
import { HttpResult } from "@/http/HttpResult";

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
          onResponse(response) {
            const respData = response.data as HttpResult<any>;
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
