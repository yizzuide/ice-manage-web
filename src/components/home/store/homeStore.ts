import { defineStore } from "pinia";

export default defineStore("home", {
  state: () => {
    return {
      selectedMenuIndex: "0",
    };
  },
  getters: {},
});
