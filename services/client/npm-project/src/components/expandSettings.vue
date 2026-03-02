<template>
  <div class="expanding-div">
    <div class="mini-text">Menu</div>
    <div class="content">
      <select @change="changePrivacy" :value="privacy">
        <option value="PRIVATE">private (nobody join)</option>
        <option value="RESTRICTED">restricted (not referenced)</option>
        <option value="PUBLIC">public, free to join</option>
      </select>
      <p>Item 2</p>
      <p>Item 3</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authFetch } from "../stores/auth";
import { ref } from "vue";

const props = defineProps<{ privacy: "PRIVATE" | "RESTRICTED" | "PUBLIC" }>();
const privacy = ref(props.privacy);

async function changePrivacy(e: Event) {
  try {
    const res = await authFetch("/api/privacy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        privacy: (e.target as HTMLSelectElement).value,
      }),
    });
    const body = await res.json();
    if (body.success) {
      privacy.value = body.data.privacy;
    } else {
      alert(body.message);
    }
  } catch (e) {
    alert(e);
  }
}
</script>

<style scoped>
.expanding-div {
  position: absolute;
  top: 110px;
  right: 10px;
  width: 50px;
  height: 50px;
  background-color: #808080;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mini-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 14px;
  z-index: 2;
  pointer-events: none;
  transition: all 0.3s ease;
}

.expanding-div:hover {
  width: 200px;
  height: 150px;
  border-radius: 12px;
}

.expanding-div:hover .mini-text {
  opacity: 0;
}

.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  width: 80%;
  color: #fff;
  text-align: center;
  transition: opacity 0.3s ease 0.2s;
}

.expanding-div:hover .content {
  opacity: 1;
}

.content select {
  background-color: #808080;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  /* appearance: none; */
  outline: none;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.content select::-ms-expand {
  display: none;
}

.content select option {
  background-color: #808080;
  width: 100px;
  color: #bb0000;
  padding: 4px 8px;
}

.content select:hover,
.content select:focus {
  background-color: #696969;
}
</style>
