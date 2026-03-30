<template>
  <img
    class="draggable"
    :class="{ editable: edit }"
    :style="{
      top: y - size / 2 + '%',
      left: x - size / 2 + '%',
      'z-index': z,
      width: size + '%',
      transform: 'rotate(' + modulo(r, 360) + 'deg)',
    }"
    @mousedown="edit && startDrag($event)"
    @contextmenu="openMenu"
    draggable="false"
    :src="link || 'https://pc.net/img/terms/right-click.svg'"
  />
  <teleport to="body">
    <div
      type="menu"
      v-if="menu.visible && props.edit"
      class="context-menu"
      :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
      @mousedown.stop
      @contextmenu.stop.prevent
    >
      <input
        @input="
          (e: InputEvent) => (link = (e.target as HTMLInputElement).value)
        "
        :value="link"
        placeholder="link"
      />
      <label
        >layer:
        <input
          type="number"
          inputmode="numeric"
          min="0"
          max="1000"
          required="true"
          :value="z"
          @input="(e) => (z = onInputRange(e, 1000))"
        />
      </label>

      <label
        >width:
        <input
          type="number"
          inputmode="numeric"
          min="3"
          max="110"
          :value="size"
          @input="(e) => (size = onInputRange(e, 110))"
        />
        %
      </label>
      <label
        >rotation:
        <input
          type="number"
          inputmode="numeric"
          required="true"
          :value="r"
          @change="(e) => (r = onChangeRotate(e))"
          @input="(e) => (r = onInputRotate(e, r))"
        />
      </label>
      <button
        class="closing"
        @click="$emit('erase', id)"
        style="background-color: #903030"
      >
        del
      </button>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, reactive } from "vue";
import type { DraggableItem } from "../../views/RoomEdit.vue";
import { onChangeRotate, onInputRange, onInputRotate, modulo } from "./utils";

const props = defineProps<{ draggable: DraggableItem; edit: boolean }>();
const id = props.draggable.id;

const x = ref(30);
const z = ref(5);
const y = ref(30);
const r = ref(0);
const size = ref(20);
const link = ref("");

onMounted(() => {
  if (props.draggable.x) x.value = props.draggable.x;
  if (props.draggable.y) y.value = props.draggable.y;
  if (props.draggable.r) r.value = props.draggable.r;
  if (props.draggable.z) z.value = props.draggable.z;
  if (props.draggable.size) size.value = props.draggable.size;
  if (props.draggable.link) link.value = props.draggable.link;
});

watch([x, y, z, r, link, size], () => saveSelf());

let dragging = false;
let offsetX = 0;
let offsetY = 0;

function saveSelf() {
  emit("update", {
    id: id,
    type: "Img",
    x: x.value,
    y: y.value,
    r: r.value,
    link: link.value,
    size: size.value,
  });
}

function startDrag(event: MouseEvent) {
  if (event.button !== 0) return;
  dragging = true;
  offsetX = event.clientX - (x.value / 100) * window.innerWidth;
  offsetY = event.clientY - (y.value / 100) * window.innerHeight;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

function onDrag(event: MouseEvent) {
  if (!dragging) return;
  x.value = ((event.clientX - offsetX) * 100) / window.innerWidth;
  y.value = ((event.clientY - offsetY) * 100) / window.innerHeight;
}

function stopDrag() {
  dragging = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

const menu = reactive({
  visible: false,
  x: 0,
  y: 0,
});

const emit = defineEmits<{
  (e: "erase", id: number): void;
  (e: "update", updated: DraggableItem): void;
}>();

watch(menu, (menu) => {
  if (menu.visible) {
    document.addEventListener("mousedown", closeMenu, { once: true });
  } else {
    document.removeEventListener("mousedown", closeMenu);
  }
});

function openMenu(e: MouseEvent) {
  menu.x = e.clientX;
  menu.y = e.clientY;
  menu.visible = true;
}

function closeMenu() {
  r.value = modulo(r.value, 360);
  if (size.value < 3) size.value = 3;
  menu.visible = false;
}

onBeforeUnmount(() => {
  stopDrag();
});
</script>

<style scoped>
.draggable {
  position: absolute;
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  border-radius: 6px;
  font-weight: bold;
}
.editable {
  cursor: move;
}
.closing {
  border-radius: 0%;
  height: fit-content;
  align-self: center;
  display: flex;
  color: white;
  padding: 2px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: x-small;
  margin: 4px 4px;
}
.context-menu {
  position: fixed;
  border-radius: 8px;
  background-color: #333; /* darker, smoother */
  border: 1px solid #555;
  color: white;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  padding: 4px;
  align-items: flex-start; /* menu items align nicely */
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.context-menu * {
  margin: 2px 0;
  padding: 4px 8px;
  border-radius: 4px;
}

.context-menu input,
.context-menu button {
  border: 1px solid #555;
  background-color: #444;
  color: white;
}

.context-menu input[type="number"] {
  width: 10ch;
}

.context-menu button:hover {
  background-color: #666;
  cursor: pointer;
}
</style>
