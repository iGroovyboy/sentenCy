<template>
  <main class="relative ml-24 mt-8 mr-8">
    <component :is="currentScreen" />
  </main>
  <app-toolbar />
</template>

<script setup lang="ts">
import AppToolbar from "./components/app-toolbar.vue";
import AppSources from "@/components/views/app-sources.vue";
import AppEditor from "@/components/views/app-editor.vue";
import AppTags from "@/components/views/app-tags.vue";
import AppHome from "@/components/views/app-home.vue";
import { SCREEN } from "@/common/screens.ts";
import { computed } from "vue";
import useMain from "@/store/use_main.ts";

// TODO: use router?
const screenMap = {
  [SCREEN.HOME]: AppHome,
  [SCREEN.SOURCES]: AppSources,
  [SCREEN.TAGS]: AppTags,
  [SCREEN.EDITOR]: AppEditor,
};

const mainStore = useMain();

const currentScreen = computed(() => screenMap[mainStore.screen]);
</script>

<style scoped></style>
