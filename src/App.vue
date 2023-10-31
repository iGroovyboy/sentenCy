<template>
  <div class="ml-16 p-8">
    <component :is="currentScreen" />
  </div>
  <app-toolbar />
</template>

<script setup lang="ts">
import AppToolbar from "./components/app-toolbar.vue";
import AppSources from "@/components/app-sources.vue";
import AppEditor from "@/components/app-editor.vue";
import AppTags from "@/components/app-tags.vue";
import { SCREEN } from "@/common/screens.ts";
import { computed } from "vue";
import useMain from "@/store/use_main.ts";

const screenMap = {
  [SCREEN.SOURCES]: AppSources,
  [SCREEN.EDITOR]: AppEditor,
  [SCREEN.TAGS]: AppTags,
};

const mainStore = useMain();

const currentScreen = computed(() => screenMap[mainStore.screen]);
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
