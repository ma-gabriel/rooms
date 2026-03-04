<template>
  <button class="add-btn" @click="goBackHome">
    <svg
      fill="#FFFFFF"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="800px"
      height="800px"
      viewBox="0 0 45.973 45.972"
      xml:space="preserve"
      style="width: 1rem; height: 1rem"
    >
      <path
        d="M44.752,20.914L25.935,2.094c-0.781-0.781-1.842-1.22-2.946-1.22c-1.105,0-2.166,0.439-2.947,1.22L1.221,20.914
			c-1.191,1.191-1.548,2.968-0.903,4.525c0.646,1.557,2.165,2.557,3.85,2.557h2.404v13.461c0,2.013,1.607,3.642,3.621,3.642h3.203
			V32.93c0-0.927,0.766-1.651,1.692-1.651h6.223c0.926,0,1.673,0.725,1.673,1.651v12.168h12.799c2.013,0,3.612-1.629,3.612-3.642
			V27.996h2.411c1.685,0,3.204-1,3.85-2.557C46.3,23.882,45.944,22.106,44.752,20.914z"
      />
    </svg>
  </button>
  <button
    @click="addDraggable({ type: 'Text', id: 0 }); changes = true"
    class="add-btn"
    style="top: 60px"
  >
    Add Text
  </button>
  <button
    @click="addDraggable({ type: 'Img', id: 0 }); changes = true"
    class="add-btn"
    style="top: 110px"
  >
    Add Image
  </button>
  <button
    @click="addDraggable({ type: 'Embed', id: 0 }); changes = true"
    class="add-btn"
    style="top: 160px"
  >
    Add Embed (youtube for now)
  </button>
  <button v-if="changes" @click="save" class="save-btn">save</button>
  <button v-if="items.length > 0" @click="clearDraggable()" class="clear-btn">
    Erase Everything
  </button>
  <expandSettings v-if="privacy" :privacy="privacy" />
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
import TextDraggable from "../components/draggables/textDraggable.vue";
import ImgDraggable from "../components/draggables/imgDraggable.vue";
import EmbedDraggable from "../components/draggables/EmbedDraggable.vue";
import expandSettings from "../components/expandSettings.vue";
import { authFetch } from "../stores/auth";
import { useRouter } from "vue-router";

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
const items = ref<DraggableItem[]>([]);

const changes = ref(false);
let intialDraggablesCounter = 0;
// basically to avoid counting the first update as a change,
// which instancies the Draggable

const privacy = ref<undefined | "PRIVATE" | "RESTRICTED" | "PUBLIC">(undefined);

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
.add-btn {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 2147483646;
}
.clear-btn {
  position: fixed;
  top: 60px;
  right: 10px;
  z-index: 1000;
  background-color: #430000ff;
}
.save-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: rgb(44, 67, 0);
}
</style>
