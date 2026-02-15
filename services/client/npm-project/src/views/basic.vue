<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TextDraggable from "../components/textDraggable.vue";
import ImgDraggable from "../components/imgDraggable.vue";
import EmbedDraggable from "../components/EmbedDraggable.vue";

onMounted(() => {
  document.addEventListener("contextmenu", (e) => e.preventDefault())
});

type DraggableItem = {
  id: number;
  type: string;
};

const items = ref<DraggableItem[]>([]);

for (let i = 0; i < localStorage.length; i++){
  if (localStorage.key(i)?.startsWith("draggable")) {
    const id = parseInt(localStorage.key(i)?.substring((localStorage.key(i)?.indexOf(':') || 0) + 1) || "");
    if (isFinite(id) && id >= 0)
      addDraggable(id, localStorage.key(i)?.substring( 9, localStorage.key(i)?.indexOf(':') || 0 ) || "Text")
  }
}

function addDraggable(id: number | undefined, type: string) {
  if (typeof id !== "number") {
    const maxId = items.value.length && Math.max(...items.value.map(item => item.id));
    id = maxId + 1;
    localStorage.setItem(`draggable${type}:${id}`, "{\"x\":30, \"y\":30}")
  }
  items.value.push({ id: id, type: type });
}

const textItems = computed(() =>
  items.value.filter(item => item.type === 'Text')
)

const imageItems = computed(() =>
  items.value.filter(item => item.type === 'Img')
)
const embedItems = computed(() =>
  items.value.filter(item => item.type === 'Embed')
)

function eraseDraggable(id: number) {
  const type = items.value.find(item => item.id === id)?.type;
  items.value = items.value.filter(item => item.id !== id);
  localStorage.removeItem(`draggable${type}:${id}`);
}

function clearDraggable() {
  if (!confirm("you sure wanna reset everything ?"))
    return;
  items.value.forEach(element => {
    localStorage.removeItem(`draggable${element.type}:${element.id}`);
  });
  items.value.length = 0;
}
</script>

<template>
  <button @click="addDraggable(undefined, 'Text')" class="add-btn">
    Add Text
  </button>
  <button @click="addDraggable(undefined, 'Img')" class="add-btn" style="top: 60px;">
    Add Image
  </button>
  <button @click="addDraggable(undefined, 'Embed')" class="add-btn" style="top: 110px;">
    Add Embed (youtube for now)
  </button>
  <button v-if="items.length > 0" @click="clearDraggable()" class="clear-btn">
    Erase Everything
  </button>

<TextDraggable
    v-for="item in textItems"
    :key="item.id"
    :id="item.id"
    @erase="eraseDraggable"
  />
  <!-- Image items -->
  <ImgDraggable
    v-for="item in imageItems"
    :key="item.id"
    :id="item.id"
    @erase="eraseDraggable"
  />
  <EmbedDraggable
    v-for="item in embedItems"
    :key="item.id"
    :id="item.id"
    @erase="eraseDraggable"
  />
</template>

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
