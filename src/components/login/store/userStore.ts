import { defineStore } from "pinia";

export default defineStore("user", {
  state: () => {
    return {
      name: "",
    };
  },
  getters: {},
  actions: {
    accountLogin(username: string, password: string) {
      console.log("login action: ", username);
    },
  },
});
