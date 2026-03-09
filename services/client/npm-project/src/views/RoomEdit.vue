<template>
  <aside class="editor-toolbar">
    <button class="tool-btn" @click="goBackHome"><HomeSVG /></button>
    <button class="tool-btn" @click="addDraggableBtn('Text')">+ Text</button>
    <button class="tool-btn" @click="addDraggableBtn('Img')">+ Image</button>
    <button class="tool-btn" @click="addDraggableBtn('Embed')">+ Embed</button>
  </aside>
  <div class="editor-actions">
    <button v-if="changes" @click="save" class="save-btn">Save changes</button>
    <button
      v-if="items.length > 0"
      class="danger-btn"
      @click="clearDraggable()"
    >
      Clear
    </button>
    <button class="settings-btn" @click="togglePrivacyTab">⚙</button>
    <PrivacySettings
      v-if="privacy && openPrivacyTab"
      :privacy="privacy"
      @close="togglePrivacyTab"
      @update="updatePrivacy"
    />
  </div>
  <TextDraggable
    v-for="item in textItems"
    :key="item.id"
    :draggable="item"
    :edit="true"
    @erase="eraseDraggable"
    @update="updateDraggable"
  />

  <ImgDraggable
    v-for="item in imageItems"
    :key="item.id"
    :draggable="item"
    :edit="true"
    @erase="eraseDraggable"
    @update="updateDraggable"
  />

  <EmbedDraggable
    v-for="item in embedItems"
    :key="item.id"
    :draggable="item"
    :edit="true"
    @erase="eraseDraggable"
    @update="updateDraggable"
  />
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import TextDraggable from "../components/draggables/TextDraggable.vue";
import ImgDraggable from "../components/draggables/ImgDraggable.vue";
import EmbedDraggable from "../components/draggables/EmbedDraggable.vue";
import PrivacySettings from "../components/PrivacySettings.vue";
import { authFetch } from "../stores/auth";
import { useRouter } from "vue-router";
import HomeSVG from "../components/svg/HomeSVG.vue";

const router = useRouter();

export type DraggableItem = {
  id: number;
  type: "Text" | "Img" | "Embed";

  // common
  z?: number;
  x?: number;
  y?: number;
  size?: number;
  r?: number;

  //text
  color?: string;
  text?: string;

  //img
  link?: string;

  //embed
  videoId?: string;
};
export type PrivacyType = "PRIVATE" | "RESTRICTED" | "PUBLIC";

const items = ref<DraggableItem[]>([]);

const changes = ref(false);
let intialDraggablesCounter = 0;
// basically to avoid counting the first update as a change,
// which instancies the Draggable

const privacy = ref<undefined | PrivacyType>(undefined);
const openPrivacyTab = ref(false);
function togglePrivacyTab() {
  openPrivacyTab.value = !openPrivacyTab.value;
}
function updatePrivacy(newPrivacy: PrivacyType) {
  privacy.value = newPrivacy;
}

onMounted(() => {
  document.addEventListener("contextmenu", prevent);
  getItems();
});

onBeforeUnmount(() => {
  document.removeEventListener("contextmenu", prevent);
});

function prevent(e: Event) {
  e.preventDefault();
}

async function getItems() {
  try {
    const res = await authFetch("/api/rooms");
    const body = await res.json();
    if (!body.success) return;
    privacy.value = body.data.privacy;
    intialDraggablesCounter = body.data.draggables.length;
    for (let i = 0; i < body.data.draggables.length; i++) {
      addDraggable(body.data.draggables[i]);
    }
  } catch (e) {
    console.error(e);
  }
}

function addDraggable(next: DraggableItem) {
  const copy = { ...next };
  const maxId =
    items.value.length && Math.max(...items.value.map((item) => item.id));
  copy.id = maxId + 1;
  items.value.push(copy);
}

function addDraggableBtn(type: "Img" | "Text" | "Embed") {
  addDraggable({ type, id: 0 });
  changes.value = true;
}

const textItems = computed(() =>
  items.value.filter((item) => item.type === "Text"),
);

const imageItems = computed(() =>
  items.value.filter((item) => item.type === "Img"),
);
const embedItems = computed(() =>
  items.value.filter((item) => item.type === "Embed"),
);

function updateDraggable(updated: DraggableItem) {
  if (intialDraggablesCounter) intialDraggablesCounter--;
  else changes.value = true;

  const searched = items.value.find((item) => item.id === updated.id);
  if (!searched) return;
  Object.assign(searched, updated);
}

function eraseDraggable(id: number) {
  changes.value = true;
  items.value = items.value.filter((item) => item.id !== id);
}

function clearDraggable() {
  if (!confirm("you sure wanna reset everything ?")) return;
  changes.value = true;
  items.value.length = 0;
}

function save() {
  authFetch("/api/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      draggables: items.value,
    }),
  });
  changes.value = false;
}

function goBackHome() {
  if (changes.value && !window.confirm("Anything unsaved will be lost")) return;
  router.replace({ name: "Home" });
}
</script>

<style scoped>
.editor-toolbar {
  position: fixed;
  top: 20px;
  left: 20px;

  display: flex;
  flex-direction: column;
  gap: 10px;

  background: #1e1f24;
  border: 1px solid #2a2c33;
  border-radius: 12px;
  padding: 10px;

  z-index: 2147483646;
}

.tool-btn {
  background: #2a2c33;
  color: #e6e6e6;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;

  font-size: 0.9rem;
}

.tool-btn:hover {
  background: #333640;
}

.editor-actions {
  position: absolute;
  top: 20px;
  right: 20px;

  display: flex;
  gap: 10px;
  z-index: 2000;
}

.settings-btn {
  width: 42px;
  height: 42px;
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

.settings-btn:hover {
  background: #2a2c33;
}

.save-btn {
  background: #2d6a4f;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.save-btn:hover {
  background: #3a8a65;
}

.danger-btn {
  background: #4a2020;
  color: #ff9090;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.danger-btn:hover {
  background: #5c2626;
}
</style>
