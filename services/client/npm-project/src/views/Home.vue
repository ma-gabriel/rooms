<template>
  <main class="page">
    <section class="rooms-card">
      <header class="rooms-header">
        <h2>🔥 Top Public Rooms</h2>
        <span class="rooms-count">{{ users.length }}</span>
      </header>

      <div class="rooms-list">
        <Selection
          v-for="user in users"
          :key="user.name"
          :name="user.name"
        />
      </div>
    </section>

    <div class="actions">
      <button class="edit-btn" @click="router.push({ name: 'Edit' })">
        <PencilSVG />
      </button>

      <button @click="logOut" class="logout-btn">
        {{ auth.authenticated ? "Log out" : "Log in" }}
      </button>
    </div>
  </main>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import Selection from "../components/Selection.vue";
import PencilSVG from "../components/svg/PencilSVG.vue";

import { useRouter } from "vue-router";
import { useAuthStore, authFetch } from "../stores/auth";
const router = useRouter();
const auth = useAuthStore();

type User = { name: string };
const users = ref<User[]>([]);

onMounted(() => {
  addUsers();
});

async function addUsers() {
  try {
    const res = await authFetch("/api/manyRooms");
    const body = await res.json();
    body.data.users.forEach((username: string) => {
      users.value.push({ name: username });
    });
  } catch (e) {
    console.error(e);
  }
}

function logOut() {
  if (auth.authenticated) auth.logout();
  else router.replace({ name: "Login" });
}
</script>

<style scoped>.page {
  max-width: 520px;
  margin: auto;
  padding: 2rem 1rem;
  color: #e6e6e6;
  font-family: system-ui, sans-serif;
}

.rooms-card {
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

.edit-btn,
.logout-btn {
  background: #2a2c33;
  color: #e6e6e6;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
}

.logout-btn {
  background: #3a2323;
  color: #ff8a8a;
}
</style>
