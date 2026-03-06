<template>
  <button class="add-btn" @click="router.push({ name: 'Home' })">
    <HomeSVG />
  </button>
  <TextDraggable
    v-for="item in textItems"
    :key="item.id"
    :draggable="item"
    :edit="false"
    @erase="eraseDraggable"
    @update="updateDraggable"
  />
  <ImgDraggable
    v-for="item in imageItems"
    :key="item.id"
    :draggable="item"
    :edit="false"
    @erase="eraseDraggable"
    @update="updateDraggable"
  />
  <EmbedDraggable
    v-for="item in embedItems"
    :key="item.id"
    :draggable="item"
    :edit="false"
    @erase="eraseDraggable"
    @update="updateDraggable"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import TextDraggable from "../components/draggables/TextDraggable.vue";
import ImgDraggable from "../components/draggables/ImgDraggable.vue";
import EmbedDraggable from "../components/draggables/EmbedDraggable.vue";

import { authFetch } from "../stores/auth";
import { useRoute, useRouter } from "vue-router";
import HomeSVG from "../components/svg/HomeSVG.vue";
const router = useRouter();
const route = useRoute();

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
    console.log(route);
    const res = await authFetch(
      `/api/rooms${route.params.user ? `/${route.params.user}` : ""}`,
    );
    const body = await res.json();
    if (!body.success) {
      alert(body.message);
      await router.push({ name: "Home" });
      return;
    }
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

function eraseDraggable() {}
function updateDraggable() {}
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
  top: 10px;
  right: 10px;
  z-index: 1000;
  background-color: #430000ff;
}
</style>
