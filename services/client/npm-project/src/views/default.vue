<template>
  <selection v-for="player in players" :key="player.name" :name="player.name" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import selection from "../components/selection.vue";

type Player = { name: string };
const players = ref<Player[]>([]);

players.value.push({ name: "Steven" });
players.value.push({ name: "Greg" });
players.value.push({ name: "Pearl" });
players.value.push({ name: "Lapiz" });
</script>

<style scoped></style>
