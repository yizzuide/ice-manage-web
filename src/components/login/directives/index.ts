import { App } from "vue";
import permissionDirective from "./permission";


export default function registerUserDirectives(app: App<Element>) {
  const [permissionName, vPermission] = permissionDirective();
  app.directive(permissionName, vPermission);
}
