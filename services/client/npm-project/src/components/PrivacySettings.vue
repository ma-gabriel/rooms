<template>
  <div class="overlay" @click="closeSelf"></div>
  <Transition name="slide">
    <aside v-if="appear" class="settings-panel">
      <h2>Room settings</h2>
      <div class="setting">
        <label>Privacy</label>
        <div class="privacy-options">
          <label>
            <input type="radio" value="PUBLIC" v-model="privacy" />
            Public
          </label>
          <label>
            <input type="radio" value="RESTRICTED" v-model="privacy" />
            Restricted
          </label>
          <label>
            <input type="radio" value="PRIVATE" v-model="privacy" />
            Private
          </label>
        </div>
      </div>
      <div v-if="privacy === 'RESTRICTED'" class="setting">
        <label>Allowed users</label>

        <input
          v-model="newUser"
          placeholder="Add username"
          @keydown.enter="addUser"
        />

        <div class="user-list">
          <div v-for="user in allowedUsers" :key="user" class="user-item">
            {{ user }}
            <button @click="removeUser(user)">✕</button>
          </div>
        </div>
      </div>

      <button class="save-btn" @click="saveSettings">Save settings</button>
    </aside>
  </Transition>
</template>
<script setup lang="ts">
import { authFetch } from "../stores/auth";
import { ref, onMounted, onUnmounted } from "vue";
import type { PrivacyType } from "../views/RoomEdit.vue";

const appear = ref(false);
const emit = defineEmits<{
  (e: "close"): void;
  (e: "update", privacy: PrivacyType): void;
}>();

function closeSelf() {
  appear.value = false;
  setTimeout(() => emit("close"), 100);
}

function handleKey(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeSelf();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKey);
  appear.value = true;
});
onUnmounted(() => window.removeEventListener("keydown", handleKey));
const props = defineProps<{ privacy: "PRIVATE" | "RESTRICTED" | "PUBLIC" }>();

const privacy = ref(props.privacy);

const allowedUsers = ref<string[]>([]);
const newUser = ref("");

function addUser() {
  if (!newUser.value.trim()) return;
  allowedUsers.value.push(newUser.value.trim());
  newUser.value = "";
}

function removeUser(name: string) {
  allowedUsers.value = allowedUsers.value.filter((u) => u !== name);
}

async function saveSettings() {
  try {
    const res = await authFetch("/api/privacy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        privacy: privacy.value,
        allowedUsers: allowedUsers.value,
      }),
    });
    const body = await res.json();
    if (body.success) {
      emit("update", body.data.privacy);
      closeSelf();
    }
  } catch (e) {
    alert(e);
  }
}
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

.setting {
  margin-bottom: 25px;
}

.privacy-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input {
  background: #2a2c33;
  border: none;
  padding: 8px;
  border-radius: 6px;
  color: white;
  width: 100%;
}

.user-list {
  margin-top: 10px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  background: #2a2c33;
  padding: 6px 8px;
  border-radius: 6px;
  margin-top: 6px;
}

.user-item button {
  background: none;
  border: none;
  color: #ff8080;
  cursor: pointer;
}

.save-btn {
  width: 100%;
  background: #2d6a4f;
  border: none;
  padding: 10px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}
.privacy-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
}

.privacy-options label:hover {
  background: #2a2c33;
}

.privacy-options input[type="radio"] {
  width: auto;
  accent-color: #2d6a4f;
  cursor: pointer;
}

/* Slide animation */

/* Slide animation */
.slide-leave-from,
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-to,
.slide-enter-from {
  transform: translateX(100%);
}
.slide-enter-active {
  transition: transform 0.25s ease;
}
.slide-leave-active {
  transition: transform 0.1s ease;
}
</style>
