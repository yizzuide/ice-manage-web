import { defineStore } from "pinia";
import useLocalStorage from "@/hooks/useLocalStorage";

const localStorage = useLocalStorage();

export const useHomeStore = defineStore("home", {
  state: () => {
    return {
      selectedMenuIndex: (function () {
        const menuIndex = localStorage.get("menuIndex");
        return menuIndex ?? "/index/dashboard";
      })(),
    };
  },
  getters: {},
  actions: {
    updateCacheMenuIndex() {
      localStorage.set("menuIndex", this.selectedMenuIndex);
    },
  },
});
