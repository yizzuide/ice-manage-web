export interface RouteInfo {
  title: string;
  path: string;
}

export interface RouteTagInfo extends RouteInfo {
  active: boolean;
  closable: boolean;
}
