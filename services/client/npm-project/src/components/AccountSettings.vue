<template>
  <div class="overlay" @click="closeSelf"></div>
  <Transition name="slide">
    <aside v-if="appear" class="settings-panel">
      <h2>Account Settings</h2>

      <div class="form-group">
        <label>Change your username</label>
        <div class="input-row">
          <input
            type="text"
            v-model="newUsername"
            placeholder="New username"
            @input="
              (e: InputEvent) =>
                (newUsername = (
                  (e.target as HTMLInputElement).value.match(/[0-9a-zA-Z_]/g) ||
                  []
                ).join(''))
            "
          />
          <button @click="changeUsername">Confirm</button>
        </div>
        <p v-if="errorMessageUsername" class="error-msg">
          {{ errorMessageUsername }}
        </p>
      </div>

      <div class="form-group">
        <label>Change your password</label>
        <div class="input-row">
          <input
            type="password"
            v-model="newPassword"
            placeholder="New password"
          />
        </div>
        <div class="input-row">
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm new password"
          />
          <button @click="changePassword">Confirm</button>
        </div>
        <p v-if="errorMessagePassword" class="error-msg">
          {{ errorMessagePassword }}
        </p>
      </div>

      <div class="actions">
        <button @click="logOut" class="logout-btn">Log Out</button>
        <button @click="deleteAccount" class="delete-btn">
          Delete Account
        </button>
      </div>
    </aside>
  </Transition>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore, authFetch } from "../stores/auth";

const auth = useAuthStore();

const newUsername = ref("");
const errorMessageUsername = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errorMessagePassword = ref("");

const appear = ref(false);
const emit = defineEmits<{
  (e: "close"): void;
  (e: "reload"): void;
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

function logOut() {
  auth.logOut();
  closeSelf();
}

async function deleteAccount() {
  if (!confirm("are you sure ? It's permanent")) return;
  try {
    const res = await fetch("api/deleteAccount", { method: "POST" });
    const body = await res.json();
    if (body.success) {
      auth.logOut({ localOnly: true });
      closeSelf();
    }
  } catch (e) {}
}

async function changeUsername() {
  errorMessageUsername.value = "";
  if (newUsername.value.length < 3) {
    errorMessageUsername.value = "username must be at least 3 chars long";
    return;
  }
  try {
    const res = await authFetch("api/updateusername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUsername.value,
      }),
    });
    const body = await res.json();
    if (body.success) {
      auth.logIn(body.data.username);
      emit("reload");
      emit("close");
      return;
    } else {
      errorMessageUsername.value = body.message;
    }
  } catch (e) {
    errorMessageUsername.value = String(e);
  }
}

async function changePassword() {
  errorMessagePassword.value = "";
  if (newPassword.value.length < 4) {
    errorMessagePassword.value = "password must be at least 4 chars long";
    return;
  } else if (newPassword.value != confirmPassword.value) {
    errorMessagePassword.value = "the two inputs must be the same";
    return;
  }
  try {
    const res = await authFetch("api/updatepassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: newPassword.value,
      }),
    });
    const body = await res.json();
    if (body.success) {
      auth.logIn(body.data.password);
    } else {
      errorMessagePassword.value = body.message;
    }
    emit("close");
  } catch (e) {
    errorMessagePassword.value = String(e);
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKey);
  appear.value = true;
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKey);
});
</script>

<style scoped>
/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1000000;
}

/* Panel */
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  height: fit-content;
  background: #2c2f38;
  border-left: 1px solid #3a3d46;
  padding: 30px 25px;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #f0f0f0;
  z-index: 1000001;
  font-family: "Segoe UI", sans-serif;
}

/* Header */
.settings-panel h2 {
  margin: 0 0 20px 0;
  font-size: 1.6rem;
  color: #fff;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
}

/* Form group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-row {
  display: flex;
  gap: 10px;
}

input[type="text"],
input[type="password"] {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #3a3d46;
  color: #f0f0f0;
  outline: none;
  transition: border 0.2s;
}

input:focus {
  border-color: #7aa6ff;
}

button {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

button:hover {
  transform: translateY(-1px);
}

/* Specific buttons */
button.logout-btn {
  background: #ff9f68;
  color: #1c1c1c;
  flex: 1;
}

button.delete-btn {
  background: #ff5f5f;
  color: #fff;
  flex: 1;
}

button.logout-btn:hover {
  background: #ffb480;
}

button.delete-btn:hover {
  background: #ff7a7a;
}

/* Error messages */
.error-msg {
  color: #ff6b6b;
  font-size: 0.85rem;
}

/* Actions row */
.actions {
  display: flex;
  gap: 15px;
  margin-top: auto;
}

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
