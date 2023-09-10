import useUserState, { Menu } from "@/components/login/store/userStore";
import { validToken } from "@/http/authHelper";
import { DynamicMenu, genDynamicMenu } from "@/tools/dynamicRoutes";
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
    meta: { title: "/" },
    component: () => import("@/components/home/HomePage.vue"),
    // 主页模板路由挂载匿名顶级路由
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
    if (!isValid) {
      if (to.name !== "login") {
        return { name: "login" };
      }
      if (to.name === "login") {
        return;
      }
    }

    // add Routes when had login before 
    const added = addDynamicRoute();

    // redirect auth user from login to index/dashboard
    if (to.name == "login") {
      return { name: "dashboard" };
    }

    // index -> dashboard
    if (to.name == "index") {
      return { name: "dashboard" };
    }
    // redirect not auth user to login
  } else if (to.name !== "login") {
    return { name: "login" };
  }
});

export function addDynamicRoute() {
  if (router.hasRoute("dashboard")) {
    return false;
  }
  // vite静态文件分析：[string, () => Promise<unknown>]
  const viteComponents = import.meta.glob("@/components/**/*Page.vue");
  const menuList = useUserState().menuList;
  const routes = genDynamicMenu<Menu>(
    {
      router: router,
      indexRouteName: "index",
      resolveComponent: (dynamicMenu: DynamicMenu) =>
        viteComponents[`/src/components${dynamicMenu.getComponentPath()}.vue`],
    },
    menuList,
    (target: Menu) => {
      return {
        getTitle: () => target.name,
        isKeepAlive: () => false,
        getRouteName: () => target.routeName,
        getRoutePath: () => target.routePath,
        getComponentPath: () => target.componentPath,
        getChildren: () => target.children!,
      };
    }
  );
  routes.forEach((r) => router.addRoute(r));
  return true;
}

export default router;
