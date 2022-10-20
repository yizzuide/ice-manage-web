import useLocalStorage from "@/hooks/useLocalStorage";
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
const isAuthenticated = localStorage.get("token");
router.beforeEach(async (to, from) => {
  console.log("route to: ", to.path);
  // redirect the user to the login page
  if (!isAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
});

export default router;
