<script setup lang="ts">
import { onMounted, ref } from "vue";
import Draggable from "./components/textDraggable.vue";

onMounted(() => {
  document.addEventListener("contextmenu", (e) => e.preventDefault())
});

type DraggableItem = {
  id: number;
};

const items = ref<DraggableItem[]>([]);

for (let i = 0; i < localStorage.length; i++){
  if (localStorage.key(i)?.startsWith("draggable:")) {
    const id = parseInt(localStorage.key(i)?.substring(10) || "");
    if (isFinite(id) && id >= 0)
      addDraggable(id)
  }
}

function addDraggable(id?: number) {
  if (typeof id !== "number") {
    const maxId = items.value.length && Math.max(...items.value.map(item => item.id));
    id = maxId + 1;
    localStorage.setItem(`draggable:${id}`, "{\"x\":100, \"y\":100}")
  }
  items.value.push({ id: id });
}

function eraseDraggable(id: number) {
  items.value = items.value.filter(item => item.id !== id);
  localStorage.removeItem(`draggable:${id}`);
}

function clearDraggable() {
  if (!confirm("you sure wanna reset everything ?"))
    return;
  items.value.forEach(element => {
    localStorage.removeItem(`draggable:${element.id}`);
  });
  items.value.length = 0;
}
</script>

<template>
  <button @click="addDraggable()" class="add-btn">
    Add Text
  </button>
  <button @click="addDraggable()" class="add-btn" style="top: 60px;">
    Add Text for now
  </button>
  <button v-if="items.length > 0" @click="clearDraggable()" class="clear-btn">
    Erase Everything
  </button>

  <Draggable
    v-for="item in items"
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
