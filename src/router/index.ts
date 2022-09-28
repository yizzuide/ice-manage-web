import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/index" },
  { path: "/:pathMatch(.*)", redirect: "/index" },
  {
    path: "/index",
    name: "index",
    component: () => import("../components/index/IndexPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../components/login/LoginPage.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

const isAuthenticated = false;
router.beforeEach(async (to, from) => {
  console.log("route to: ", to.path);

  // redirect the user to the login page
  if (!isAuthenticated && to.name !== "login") {
    return { name: "login" };
  }
});

export default router;
