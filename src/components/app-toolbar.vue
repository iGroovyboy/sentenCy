<template>
  <nav
    class="toolbar bg-dark-200 flex flex-col fixed w-16 h-screen top-0 p-2 pt-5"
    aria-label="Main menu"
    role="navigation"
  >
    <app-icon-btn
      v-for="btn in buttons"
      :key="btn.name"
      @click="btn.action ? btn.action() : mainStore.setScreen(btn.screen || 0)"
      :icon-class="btn.icon"
      :is-active="mainStore.screen === btn.screen"
      :aria-label="btn.name"
    />
  </nav>
</template>

<script setup lang="ts">
import AppIconBtn from "./app-icon-btn.vue";
import useMain from "@/store/use_main";
import { SCREEN } from "@/common/screens.ts";
import { csvExport } from "@/common/export.ts";
import { openWindowWithBlob } from "@/common/helpers.ts";

const mainStore = useMain();

const save = () => {
  const data = csvExport();
  if (data?.length) {
    openWindowWithBlob(data);
  } else {
    alert("Export data is empty");
  }
};

interface ToolbarButton {
  name: string;
  icon: string;
  screen?: number;
  action?(): any;
}

const buttons: ToolbarButton[] = [
  {
    name: "home",
    icon: "fa-home",
    screen: SCREEN.HOME,
  },
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

<style lang="scss" scoped></style>
