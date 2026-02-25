import { createRouter, createWebHistory } from "vue-router";
import Basic from "./views/basic.vue";
import Login from "./views/login.vue";
import Register from "./views/register.vue";
import { useAuthStore } from "./stores/auth";

const routes = [
  { path: "/:catchAll(.*)", component: Basic, meta: { requiresAuth: true } },
  { path: "/login", component: Login, meta: { title: "sign in" } },
  { path: "/register", component: Register, meta: { title: "sign up" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!auth.loaded) {
    await auth.fetchUser();
  }

  if (to.meta.requiresAuth && !auth.authenticated) {
    return "/login";
  }
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || "rooms";
});

export default router;
