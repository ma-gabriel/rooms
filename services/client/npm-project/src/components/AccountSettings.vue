<template>
  <div class="overlay" @click="$emit('close')"></div>
  <aside class="settings-panel">
    <h2>Account settings</h2>
      <button @click="logOut" class="logout-btn">
        {{ auth.authenticated ? "Log out" : "Log in" }}
      </button>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();

const emit = defineEmits<{
  (e: "close"): void;
}>();

function handleKey(e: KeyboardEvent) {
  if (e.key === "Escape") emit("close");
}

function logOut() {
  auth.logout();
  emit("close");
}

onMounted(() => window.addEventListener("keydown", handleKey));
onUnmounted(() => window.removeEventListener("keydown", handleKey));


</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: #1e1f24;
  border-left: 1px solid #2a2c33;
  padding: 20px;
  transform: translateX(100%);
  transition: transform 0.25s ease;
  transform: translateX(0);
}

.settings-panel h2 {
  margin-bottom: 20px;
}

.logout-btn {
  background: #3a2323;
  color: #ff8a8a;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
}

/* 
.save-btn {
  width: 100%;
  background: #2d6a4f;
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
} */
</style>
