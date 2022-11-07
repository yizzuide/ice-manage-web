import { Router, RouteRecordRaw, RouteComponent } from "vue-router";
import { createProxyList, ObjectProxy } from "./interfaceProxy";

// 定义路由菜单代理对象类型
type DynamicMenuProxy<T> = ObjectProxy<T> & DynamicMenu;

/**
 * 动态路由菜单
 */
export interface DynamicMenu {
  getTitle: () => string;
  isKeepAlive: () => boolean;
  getRouteName: () => string;
  getRoutePath: () => string;
  getComponentPath: () => string;
  getChildren: () => any[];
}

export interface DynamicMenuConfig<T> {
  router: Router;
  // 主页组件路由名（用于挂载动态路由）
  indexRouteName: string;
  // 主页组件（内部可自动根据`indexRouteName`获取，用于父路由的component）
  indexComponent?: (() => Promise<unknown>) | RouteComponent;
  // 解析子组件
  resolveComponent: (dynamicMenu: DynamicMenu) => () => Promise<unknown>;
}

export function genDynamicMenu<T extends DynamicMenu>(
  config: DynamicMenuConfig<T>,
  menuList: T[],
  methods: (target: T) => DynamicMenu
) {
  // 如果外面没有设置，自动查找主页模板组件
  if (!config.indexComponent) {
    const indexRoute = config.router
      .getRoutes()
      .find((r) => r.name === config.indexRouteName);
    config.indexComponent = indexRoute?.components?.default;
  }
  const dynamicMenuProxyList = createProxyList(menuList, methods);
  const routes: RouteRecordRaw[] = [];
  for (const menu of dynamicMenuProxyList) {
    // 添加匿名顶级页面
    if (!menu.getChildren() || menu.getChildren().length == 0) {
      // 如果有主页组件模板
      if (
        config.indexRouteName &&
        menu.getRoutePath().indexOf(config.indexRouteName) !== -1
      ) {
        config.router.addRoute(
          config.indexRouteName,
          createRoute(menu, methods, false, config.resolveComponent(menu))
        );
      } else {
        // 子路由
        routes.push(
          createRoute(menu, methods, false, config.resolveComponent(menu))
        );
      }
    } else {
      // 父路由
      const rootRoute: RouteRecordRaw = createRoute(
        menu,
        methods,
        true,
        config.indexComponent!
      );
      // 递归添加子路由
      rootRoute.children?.push(
        ...genDynamicMenu(config, menu.getChildren(), methods)
      );
      routes.push(rootRoute);
    }
  }
  return routes;
}

function createRoute<T>(
  menu: DynamicMenuProxy<T>,
  methods: (target: T) => DynamicMenu,
  isRoot: boolean,
  component: (() => Promise<unknown>) | RouteComponent
) {
  let route: RouteRecordRaw = {
    name: menu.getRouteName(),
    path: menu.getRoutePath(),
    meta: {
      title: menu.getTitle(),
      keepAlive: menu.isKeepAlive(),
    },
    component: component,
  };
  if (isRoot) {
    route = {
      ...route,
      children: [],
      // 父路由重定向到第一个子路由
      redirect: methods(menu.getChildren()?.[0]).getRoutePath(),
    };
  }
  return route;
}
