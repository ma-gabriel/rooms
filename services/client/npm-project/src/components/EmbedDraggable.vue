<template>
  <div
    class="draggable"
    :style="{ top: y - size / 2 + '%', left: x - size / 2 + '%', 'z-index': z, width: size + '%', height: size + '%', transform: 'rotate(' + r + 'deg)' }"
    @mousedown="startDrag"
    @contextmenu="openMenu"
  >
    <svg 
      style="position: absolute; top: 0%; right: 2%; height: 30%"
      fill="#FFFFFF"
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 417.031 417.031"
      xml:space="preserve">
      <g>
        <path d="M219.683,92.146c-0.279-0.315-0.52-0.627-0.849-0.925c-3.644-3.272-3.742-2.306,0.247-5.983
          c2.955-2.712,6.541-4.834,9.79-7.18c8.596-6.213,14.254-14.534,18.079-24.399c8.582-22.15-16.706-37.453-29.396-50.562
          c-9.168-9.485-23.603,4.982-14.444,14.447c7.076,7.325,16.19,13.264,22.349,21.407c6.897,9.116-3.613,19.174-10.814,24.249
          c-11.133,7.844-20.757,18.262-18.533,29.434c-49.964,4.668-96.16,32.052-96.16,80.327v135.51
          c0,59.862,48.698,108.562,108.564,108.562c59.863,0,108.566-48.7,108.566-108.562V172.95
          C317.085,120.247,268.05,94.723,219.683,92.146z M120.391,172.95c0-35.833,38.898-56.581,79.186-60.027v124.982
          c-36.751-1.85-66.589-10.222-79.186-14.309V172.95z M296.648,308.461c0,48.604-39.537,88.133-88.129,88.133
          c-48.59,0-88.128-39.529-88.128-88.133V245.08c18.249,5.516,52.6,13.882,93.202,13.882c26.003,0,54.556-3.479,83.056-13.286
          V308.461z M296.648,223.94c-25.844,9.883-52.237,13.746-76.635,14.271v-125.59c39.407,2.363,76.635,21.264,76.635,60.337V223.94z
          M289.735,216.203c0,0-46.688,13.073-62.567,10.271V122.813C269.429,130.753,296.625,143.533,289.735,216.203z"/>
      </g>
    </svg>
    <iframe
      style="width: 100%; height: 100%;"
      :src="'https://www.youtube.com/embed/' + (id || 'liJVSwOiiwg')"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  </div>
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
      @input="(e: InputEvent) => (id = (e.target as HTMLInputElement).value)"
      :value="id"
      placeholder="video id (watch?v=[ID HERE])"
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
      <label>size:
        <input
          type="number"
          inputmode="numeric"
          min="20"
          max="100"
          @input="(e: InputEvent) => (e.target as HTMLInputElement).value = String(size = Math.min(Math.max(parseInt((e.target as HTMLInputElement).value) || 0, 0), 100))"
          :value="size"
          />
      </label>
      <label>rotation:
        <input
          type="number"
          inputmode="numeric"
          min="0"
          max="360"
          required="true"
          @input="(e: InputEvent) => (e.target as HTMLInputElement).value = String(r = Math.min(Math.max(parseInt((e.target as HTMLInputElement).value) || 0, 0), 360))"
          :value="r"
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
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, reactive } from "vue";

const props = defineProps<{ id: number }>();

const x = ref(100);
const z = ref(10);
const y = ref(100);
const r = ref(0);
const size = ref(20);
const id = ref("liJVSwOiiwg");

onMounted(() => {
  const saved = localStorage.getItem(`draggableEmbed:${props.id}`);
  if (!saved) {
    saveSelf();
    return;
  }
  const { x: sx, y: sy, z: sz, r: sr, id: sid, size: ssize} = JSON.parse(saved);
  if (sx !== undefined) x.value = sx;
  if (sy !== undefined) y.value = sy;
  if (sz !== undefined) z.value = sz;
  if (sr !== undefined) r.value = sr;
  if (ssize !== undefined) size.value = ssize;
  if (sid !== undefined) id.value = sid;
});

watch([x, y, z, r, id, size], () => saveSelf());

let dragging = false;
let offsetX = 0;
let offsetY = 0;

function saveSelf() {
  localStorage.setItem(
    `draggableEmbed:${props.id}`,
    JSON.stringify({ x: x.value, y: y.value, z: z.value, r: r.value, id: id.value, size: size.value})
  );
}

function startDrag(event: MouseEvent) {
  if (event.button !== 0)
    return;
  dragging = true;
  offsetX = event.clientX - x.value / 100 * window.innerWidth;
  offsetY = event.clientY - y.value / 100 * window.innerHeight;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

function onDrag(event: MouseEvent) {
  if (!dragging) return;
  x.value = (event.clientX - offsetX) * 100 / window.innerWidth;
  y.value = (event.clientY - offsetY) * 100 / window.innerHeight;
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

const emit = defineEmits<{
  (e: 'erase', id: number): void
}>()

function openMenu(e: MouseEvent) {
  menu.x = e.clientX;
  menu.y = e.clientY;
  menu.visible = true;
}

function closeMenu() {
  if (size.value < 20) size.value = 20
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
  flex-direction: column;
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