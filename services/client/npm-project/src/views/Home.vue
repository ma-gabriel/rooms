<template>
  <main class="page">
    <div class="fixed-search">
      <input type="text" placeholder="Search users..." class="search-input" />
      <Selection v-for="user in users" :key="user.name" :name="user.name" />
    </div>
    <section class="rooms-card">
      <header class="rooms-header">
        <h2>🔥 Top Public Rooms</h2>
        <span class="rooms-count">{{ users.length }}</span>
      </header>

      <div class="rooms-list">
        <Selection v-for="user in users" :key="user.name" :name="user.name" />
      </div>
      <button class="reload-btn" @click="addUsers">
        <ReloadSVG height="1em" />
      </button>
    </section>

    <div class="actions">
      <button
        class="edit-btn"
        v-if="auth.authenticated"
        @click="router.push({ name: 'Edit' })"
      >
        <PencilSVG height="1em" />
      </button>
      <button @click="logIn" v-if="!auth.authenticated" class="login-btn">
        Log in
      </button>

      <button
        class="settings-btn"
        v-if="auth.authenticated"
        @click="toggleSettingsTab"
      >
        <AccountSVG height="1em" />
      </button>
      <AccountSettings
        v-if="openSettingsTab"
        @close="toggleSettingsTab"
        @reload="addUsers"
      />
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import Selection from "../components/Selection.vue";
import PencilSVG from "../components/svg/PencilSVG.vue";
import AccountSVG from "../components/svg/AccountSVG.vue";

import { useRouter } from "vue-router";
import { useAuthStore, authFetch } from "../stores/auth";
import AccountSettings from "../components/AccountSettings.vue";
import ReloadSVG from "../components/svg/ReloadSVG.vue";
const router = useRouter();
const auth = useAuthStore();

type User = { name: string };
const users = ref<User[]>([]);

const openSettingsTab = ref(false);
function toggleSettingsTab() {
  openSettingsTab.value = !openSettingsTab.value;
}

onMounted(() => {
  addUsers();
});

async function addUsers() {
  try {
    const res = await authFetch("/api/manyRooms");
    const body = await res.json();
    users.value.length = 0;
    body.data.users.forEach((username: string) => {
      users.value.push({ name: username });
    });
  } catch (e) {
    console.error(e);
  }
}

function logIn() {
  router.replace({ name: "Login" });
}
</script>

<style scoped>
.page {
  max-width: 520px;
  margin: auto;
  padding: 2rem 1rem;
  color: #e6e6e6;
  font-family: system-ui, sans-serif;
}

.fixed-search {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: #1e1f24;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid #2a2c33;
}

.fixed-search > * {
  margin-top: 2px;
  padding: 0.1rem 0rem;
}

.fixed-search .search-input {
  width: 200px;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #2a2c33;
  background: #262830;
  color: #e6e6e6;
  font-size: 0.9rem;
}

.fixed-search .search-input::placeholder {
  color: #888c96;
}

.fixed-search .search-input:focus {
  outline: none;
  border-color: #7aa6ff;
  background: #2a2c33;
}

.rooms-card {
  width: 33vw;
  background: #1e1f24;
  border-radius: 14px;
  border: 1px solid #2a2c33;
  overflow: hidden;
}

.rooms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.3rem;
  border-bottom: 1px solid #2a2c33;
}

.rooms-header h2 {
  font-size: 1.1rem;
  margin: 0;
  color: #ffffff;
}

.rooms-count {
  background: #2a2c33;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #b9bbbe;
}

.rooms-list > * {
  padding: 0.9rem 1.3rem;
  border-bottom: 1px solid #2a2c33;
}

.rooms-list > *:hover {
  background: #262830;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.edit-btn {
  background: #2a2c33;
  color: #e6e6e6;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
}

.settings-btn {
  padding: 0.5rem 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  border: 1px solid #2a2c33;
  background: #1e1f24;
  color: #e6e6e6;
  cursor: pointer;
}

.login-btn {
  background: #233a23;
  color: #a5ff8a;
}

.reload-btn {
  position: absolute;
  top: 20px;
  right: 20px;

  border-radius: 6px;
  background: #3a3d46;
  color: #f0f0f0;
  border: 1px solid #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.reload-btn:hover {
  background: #4a4e58;
  border-color: #7aa6ff;
}
</style>
