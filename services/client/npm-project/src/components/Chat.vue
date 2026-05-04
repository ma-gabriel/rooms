<template>
  <div
    class="chat-container"
    :style="{
      top: y + '%',
      left: x + '%',
    }"
  >
    <div
      class="chat-header"
      @mousedown="startDrag($event)"
      style="position: relative"
    >
      <ReduceSVG class="reduce-logo" @click="()=>{hidden = !hidden}"/>
      <h3 style="user-select: none">Chat</h3>
    </div>

    <div v-if="!hidden" class="chat-messages">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-message', msg.sender]"
      >
        {{ msg.text }}
      </div>
    </div>

    <div class="chat-input" v-if="!hidden">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ReduceSVG from "./svg/ReduceSVG.vue";

const x = ref(5);
const y = ref(1);
placeChat();
const hidden = ref(false);

function placeChat() {
  const coos = localStorage.getItem("chat");
  if (!coos) return;
  const buff = coos.split(",");
  if (
    buff === undefined ||
    buff.length !== 2 ||
    isNaN(Number(buff[0])) ||
    isNaN(Number(buff[1]))
  )
    return;
  x.value = Number(buff[0]);
  y.value = Number(buff[1]);
}

let dragging = false;
let offsetX = 0;
let offsetY = 0;

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
  localStorage.setItem("chat", `${x.value},${y.value}`);
}
</script>
<style scoped>
.chat-container {
  position: absolute;
  z-index: 2000000;
  width: 350px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.chat-header {
  cursor: move;
  background: #4a76a8;
  color: white;
  text-align: center;
}

.chat-messages {
  padding: 10px;
  height: 300px;
  overflow-y: auto;
  background: #f5f5f5;
}

.chat-message {
  max-width: 70%;
  padding: 8px 12px;
  margin-bottom: 10px;
  border-radius: 15px;
  word-wrap: break-word;
}

.chat-message.user {
  background: #4a76a8;
  color: white;
  margin-left: auto;
  text-align: right;
}

.reduce-logo {
  position: absolute;
  height: 1em;
  width: auto;
  top: 5px;
  right: 5px;
  background-color: #223852;
  padding: 5px;
  border-radius: 25%;
}

.chat-message.bot {
  background: #e0e0e0;
  color: #333;
  margin-right: auto;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
}

.chat-input button {
  padding: 10px 15px;
  border: none;
  background: #4a76a8;
  color: white;
  cursor: pointer;
}

.chat-input button:hover {
  background: #3b5f87;
}
</style>
