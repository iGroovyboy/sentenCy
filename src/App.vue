<template>
  <main class="relative ml-24 mt-8 mr-8">
    <router-view></router-view>
  </main>
  <app-toolbar />
</template>

<script setup lang="ts">
import AppToolbar from "./components/app-toolbar.vue";
</script>

<style scoped></style>
