import { defineStore } from "pinia";
import router from "../router";

export async function authFetch(url: string, options = {}) {
  const auth = useAuthStore();
  const res = await fetch(url, options);
  if (res.status === 401) {
    router.push({ name: "Login" });
    auth.logOut();
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
    /**
     * will fetch a log out, and set the auth variables as well
     * @param options localOnly to true will avoid fetching
     */
    async logOut(options?: { localOnly?: boolean }) {
      const disconnect = () => {
        this.user = null;
        this.authenticated = false;
        this.loaded = true;
      };
      if (options === undefined) options = {};
      if (options.localOnly) {
        disconnect();
        return;
      }
      try {
        const res = await fetch("/api/logout", { method: "POST" });
        const body = await res.json();
        if (body.success) {
          disconnect();
        }
      } catch (e) {}
    },
    logIn(username: string) {
      this.user = username;
      this.authenticated = true;
      this.loaded = true;
    },
  },
});
