<template>
  <selection v-for="user in users" :key="user.name" :name="user.name"/>
  <button @click="logOut" class="logout-btn">
    {{ auth.authenticated ? "log out" : "log in page" }}
  </button>
  <button class="edit-btn" @click="router.push({ name: 'Edit' })">
    <PencilSVG/>
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import selection from "../components/selection.vue";
import PencilSVG from "../components/svg/pencilSVG.vue";

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

<style scoped>
.edit-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
}
.logout-btn {
  position: fixed;
  top: 60px;
  right: 10px;
  z-index: 1000;
  background-color: #430000ff;
}
</style>
