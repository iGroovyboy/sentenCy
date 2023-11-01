<template>
  <div class="ml-24 mt-8">
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

<style scoped></style>
