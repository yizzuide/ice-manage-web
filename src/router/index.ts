import { validToken } from "@/http/authHelper";
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

router.beforeEach(async (to, from) => {
  const result = validToken();
  const isAuthenticated = result[0];
  if (isAuthenticated) {
    const isValid = result[1];
    // token is expire
    if (!isValid && to.name !== "login") {
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
