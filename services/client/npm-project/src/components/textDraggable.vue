<template>
  <div
    class="draggable"
    :style="{ top: y + 'px', left: x + 'px', 'z-index': z, color: color }"
    @mousedown="startDrag"
    @contextmenu="openMenu"
  >
    {{ text }}
    <teleport to="body">
      <div
          type="menu"
          v-if="menu.visible"
          class="context-menu"
          :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
          @mousedown.stop
          @contextmenu.stop.prevent
      >
        <input
        @input="(e: InputEvent) => (text = (e.target as HTMLInputElement).value)"
        :value="text"
        />
        <label>layer:
          <input
            type="number"
            inputmode="numeric"
            min="0"
            max="1000"
            required="true"
            @input="(e: InputEvent) => (e.target as HTMLInputElement).value = String(z = Math.min(Math.max(parseInt((e.target as HTMLInputElement).value) || 0, 0), 1000))"
            :value="z"
            />
        </label>
        <label> text color:
          <input
            type="color"
            @input="(e: InputEvent) => (color = (e?.target as HTMLInputElement).value)"
            :value="color"
            />
        </label>
        <button
          class="closing"
          @click="$emit('erase', props.id)"
          style="background-color: #903030;"
          >del
        </button>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, reactive, computed} from "vue";

const props = defineProps<{ id: number }>();

const x = ref(100);
const z = ref(0);
const y = ref(100);
const color = ref("#FFFFFFFF");
const text = ref("right click");

onMounted(() => {
  const saved = localStorage.getItem(`draggable:${props.id}`);
  if (!saved) {
    saveSelf();
    return;
  }
  const { x: sx, y: sy, z: sz, text: stext, color: scolor} = JSON.parse(saved);
  if (sx) x.value = sx;
  if (sy) y.value = sy;
  if (sz) z.value = sz;
  if (stext) text.value = stext;
  if (scolor) color.value = scolor;
});

watch([x, y, z, text, color], () => saveSelf());

let dragging = false;
let offsetX = 0;
let offsetY = 0;

function saveSelf() {
  localStorage.setItem(
    `draggable:${props.id}`,
    JSON.stringify({ x: x.value, y: y.value, z: z.value, text: text.value, color: color.value})
  );
}

function startDrag(event: MouseEvent) {
  if (event.button !== 0)
    return;
  dragging = true;
  offsetX = event.clientX - x.value;
  offsetY = event.clientY - y.value;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

function onDrag(event: MouseEvent) {
  if (!dragging) return;
  x.value = event.clientX - offsetX;
  y.value = event.clientY - offsetY;
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
    document.addEventListener('mousedown', closeMenu, {once: true})
  } else {
    document.removeEventListener('mousedown', closeMenu)
  }
})

function openMenu(e: MouseEvent) {
  menu.x = e.clientX;
  menu.y = e.clientY;
  menu.visible = true;
}

const zModel = computed({
  get: () => z.value,
  set: (value: number) => {
    z.value = Math.min(Math.max(value, 0), 1000)
  }
})

function closeMenu() {
  menu.visible = false;
}

function doAction(action: string) {
  console.log(action);
  closeMenu();
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
  background-color: #333;  /* darker, smoother */
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