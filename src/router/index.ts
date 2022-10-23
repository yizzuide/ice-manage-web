import useUserState, { Menu } from "@/components/login/store/userStore";
import { validToken } from "@/http/authHelper";
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/index" },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/login/LoginPage.vue"),
  },
  {
    path: "/index",
    name: "index",
    component: () => import("@/components/home/HomePage.vue"),
    children: [],
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

    // add Routes
    addDynamicRoute();
  }
  // redirect not auth user to login
  if (!isAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
});

export function addDynamicRoute() {
  if (router.hasRoute("dashboard")) {
    return;
  }
  // vite动态导入
  const viteComponent = import.meta.glob("@/components/**/*Page.vue");
  const menuList = useUserState().menuList;
  for (const menu of menuList) {
    // 添加匿名顶级页面
    if (!menu.children || menu.children.length == 0) {
      router.addRoute("index", {
        name: menu.routeName,
        path: menu.routePath,
        component: viteComponent[`/src/components${menu.componentPath}.vue`],
      });
    } else {
      // 添加根菜单
      const rootRoute: RouteRecordRaw = {
        name: menu.routeName,
        path: menu.routePath,
        component: () => import("@/components/home/HomePage.vue"),
        children: [],
      };
      for (const subMenu of menu.children) {
        rootRoute.children.push({
          name: subMenu.routeName,
          path: subMenu.routePath,
          component:
            viteComponent[`/src/components${subMenu.componentPath}.vue`],
        });
      }
      router.addRoute(rootRoute);
    }
  }
}

export default router;
