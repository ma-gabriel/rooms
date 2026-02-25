import { defineStore } from "pinia";
import router from "../router";

export async function authFetch(url: string, options = {}) {
  const auth = useAuthStore();
  const res = await fetch(url, options);
  if (res.status === 401) {
    router.push("/login");
    auth.logout();
    throw new Error("Unauthorized: user has been logged out");
  }
  return res;
}

export const useAuthStore = defineStore("auth", {
  state: (): {
    user: string | null;
    authenticated: boolean;
    loaded: boolean;
  } => ({
    user: null,
    authenticated: false,
    loaded: false,
  }),

  actions: {
    async fetchUser() {
      if (this.loaded) return;

      try {
        const response = await fetch("/api/info");
        const body = await response.json();
        this.user =
          body.success && body.data.username ? body.data.username : null;
      } catch (e) {
        this.user = null;
      } finally {
        this.authenticated = !!this.user;
        this.loaded = true;
      }
    },
    logout() {
      fetch("/api/logout", { method: "POST" });
      this.user = null;
      this.authenticated = false;
      this.loaded = true;
    },
    login(username: string) {
      this.user = username;
      this.authenticated = true;
      this.loaded = true;
    },
  },
});
