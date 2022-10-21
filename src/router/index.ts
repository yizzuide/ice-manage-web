import useLocalStorage from "@/hooks/useLocalStorage";
import { ElMessage } from "element-plus";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/index" },
  {
    path: "/index",
    name: "index",
    component: () => import("@/components/home/HomePage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/login/LoginPage.vue"),
  },
  { path: "/:pathMatch(.*)", redirect: "/" },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

const localStorage = useLocalStorage();
router.beforeEach(async (to, from) => {
  const isAuthenticated = localStorage.get("token");
  const expire = localStorage.get("tokenExpire") as number;
  if (isAuthenticated) {
    // auth user need check token is expire
    const isValid = expire > Date.now();
    if (!isValid) {
      localStorage.clear();
      ElMessage.error("登录时间过期，请重新登录！");
      return { name: "login" };
    }
    // redirect auth user to index
    if (to.name == "login") {
      return { name: "index" };
    }
  }
  // redirect not auth user to login
  if (!isAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
});

export default router;
