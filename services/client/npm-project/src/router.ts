import { createRouter, createWebHistory } from "vue-router";
import RoomEdit from "./views/RoomEdit.vue";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Register from "./views/Register.vue";
import { useAuthStore } from "./stores/auth";
import RoomView from "./views/RoomView.vue";

const routes = [
  {
    path: "/:catchAll(.*)",
    component: Home,
    meta: { title: "home" },
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "home" },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "sign in" },
  },
  {
    path: "/edit",
    name: "Edit",
    component: RoomEdit,
    meta: { requiresAuth: true },
  },
  {
    path: "/view/:user",
    name: "View",
    component: RoomView,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { title: "sign up" },
  },
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
    return {
      name: "Login",
      query: { redirect: to.fullPath },
    };
  }
});

router.afterEach((to) => {
  document.title = (to.meta.title as string) || "rooms";
});

export default router;
