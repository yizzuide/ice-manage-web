import { RouteLocationNormalizedLoaded } from "vue-router";

export interface RouteInfo {
  title: string;
  path: string;
}

export interface RouteTagInfo extends RouteInfo {
  active: boolean;
  closable: boolean;
}

export interface IRouteChange {
  (preRoutePath: string, route: RouteLocationNormalizedLoaded): void;
}
