<template>
  <div
    class="draggable"
    :style="{
      top: y + '%',
      left: x + '%',
      'z-index': z,
      color: color,
      'font-size': size / 10 + 'vw',
      transform: 'rotate(' + r + 'deg)',
    }"
    @mousedown="startDrag"
    @contextmenu="openMenu"
  >
    {{ text || "right click" }}
  </div>
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
          (e: InputEvent) => (text = (e.target as HTMLInputElement).value)
        "
        :value="text"
      />
      <label
        >layer:
        <input
          type="number"
          inputmode="numeric"
          min="0"
          max="1000"
          required="true"
          @input="
            (e: InputEvent) =>
              ((e.target as HTMLInputElement).value = String(
                (z = Math.min(
                  Math.max(
                    parseInt((e.target as HTMLInputElement).value) || 0,
                    0,
                  ),
                  1000,
                )),
              ))
          "
          :value="z"
        />
      </label>
      <label
        >size:
        <input
          type="number"
          inputmode="numeric"
          min="8"
          max="200"
          @input="
            (e: InputEvent) =>
              ((e.target as HTMLInputElement).value = String(
                (size = Math.min(
                  Math.max(
                    parseInt((e.target as HTMLInputElement).value) || 0,
                    0,
                  ),
                  200,
                )),
              ))
          "
          :value="size"
        />
      </label>
      <label>
        text color:
        <input
          type="color"
          @input="
            (e: InputEvent) => (color = (e?.target as HTMLInputElement).value)
          "
          :value="color"
        />
      </label>
      <label
        >rotation:
        <input
          type="number"
          inputmode="numeric"
          min="0"
          max="360"
          required="true"
          @input="
            (e: InputEvent) =>
              ((e.target as HTMLInputElement).value = String(
                (r = Math.min(
                  Math.max(
                    parseInt((e.target as HTMLInputElement).value) || 0,
                    0,
                  ),
                  360,
                )),
              ))
          "
          :value="r"
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
import type { DraggableItem } from "../../views/room_edit.vue";

const props = defineProps<{ draggable: DraggableItem, edit: boolean }>();
const id = props.draggable.id;
const x = ref(30);
const z = ref(15);
const y = ref(30);
const r = ref(0);
const size = ref(16);
const color = ref("#FFFFFFFF");
const text = ref("right click");

onMounted(() => {
  if (props.draggable.x) x.value = props.draggable.x;
  if (props.draggable.y) y.value = props.draggable.y;
  if (props.draggable.r) r.value = props.draggable.r;
  if (props.draggable.z) z.value = props.draggable.z;
  if (props.draggable.size) size.value = props.draggable.size;
  if (props.draggable.text) text.value = props.draggable.text;
  if (props.draggable.color) color.value = props.draggable.color;
});

watch([x, y, z, r, text, color, size], () => saveSelf());

let dragging = false;
let offsetX = 0;
let offsetY = 0;

function saveSelf() {
  emit("update", {
    id: id,
    type: "Text",
    x: x.value,
    y: y.value,
    r: r.value,
    text: text.value,
    color: color.value,
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

watch(menu, (menu) => {
  if (menu.visible) {
    document.addEventListener("mousedown", closeMenu, { once: true });
  } else {
    document.removeEventListener("mousedown", closeMenu);
  }
});

const emit = defineEmits<{
  (e: "erase", id: number): void;
  (e: "update", updated: DraggableItem): void;
}>();

function openMenu(e: MouseEvent) {
  menu.x = e.clientX;
  menu.y = e.clientY;
  menu.visible = true;
}

function closeMenu() {
  if (size.value < 8) size.value = 8;
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
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  border-radius: 6px;
  font-weight: bold;
  white-space: nowrap;
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

.context-menu button:hover {
  background-color: #666;
  cursor: pointer;
}
</style>
