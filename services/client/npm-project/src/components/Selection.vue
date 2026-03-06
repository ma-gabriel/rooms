<template>
  <div
    class="player-list"
    @click="router.push({ name: 'View', params: { user: props.name } })"
  >
    <div class="player-item">
      <div class="player-bg">
        <svg class="bg-icon icon-1" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
        <svg class="bg-icon icon-2" viewBox="0 0 24 24">
          <rect x="4" y="4" width="16" height="16" />
        </svg>
        <svg class="bg-icon icon-3" viewBox="0 0 24 24">
          <polygon points="12,2 22,22 2,22" />
        </svg>
      </div>
      <div class="player-content">
        <span class="player-name">{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps<{
  name: string;
}>();
</script>

<style scoped>
body {
  background: #0f172a;
  font-family: Arial, sans-serif;
  padding: 40px;
}

/* Container */
.player-list {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Each row */
.player-item {
  position: relative;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

/* Hover effect */
.player-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

/* Background SVG wrapper */
.player-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Background icons */
.bg-icon {
  position: absolute;
  width: 80px;
  height: 80px;
  fill: rgba(255, 255, 255, 0.05);
}

/* Individual icon positioning */
.icon-1 {
  left: 20px;
  top: -10px;
}

.icon-2 {
  right: 40px;
  bottom: -20px;
}

.icon-3 {
  left: 150px;
  top: 10px;
}

/* Content */
.player-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.player-name {
  color: white;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
