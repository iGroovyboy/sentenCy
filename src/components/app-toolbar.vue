<template>
  <div class="toolbar flex flex-col fixed w-16 h-screen top-0 p-2">
    <app-icon-btn
      v-for="btn in buttons"
      :key="btn.name"
      @click="btn.action ? btn.action() : mainStore.setScreen(btn.screen)"
      :icon-class="btn.icon"
      :is-active="mainStore.screen === btn.screen"
    />
  </div>
</template>

<script setup lang="ts">
import AppIconBtn from "./app-icon-btn.vue";
import useMain from "@/store/use_main";
import { SCREEN } from "@/common/screens.ts";

const mainStore = useMain();

const save = () => {
  console.log("save to csv");
};

interface ToolbarButton {
  name: string;
  icon: string;
  screen?: number;
  action?(): any;
}

const buttons: ToolbarButton[] = [
  {
    name: "sources",
    icon: "fa-list-ul",
    screen: SCREEN.SOURCES,
  },
  {
    name: "tags",
    icon: "fa-tags",
    screen: SCREEN.TAGS,
  },
  {
    name: "editor",
    icon: "fa-pencil-square-o",
    screen: SCREEN.EDITOR,
  },
  {
    name: "download",
    icon: "fa-download",
    action: save,
  },
];
</script>

<style lang="scss" scoped>
.toolbar {
  background-color: #212120;
}
</style>
