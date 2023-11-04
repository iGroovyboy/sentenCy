<template>
  <nav
    class="toolbar bg-dark-200 flex flex-col fixed w-16 h-screen top-0 p-2 pt-5"
    aria-label="Main menu"
    role="navigation"
  >
    <app-icon-btn
      v-for="btn in buttons"
      :key="btn.name"
      @click="btn.action ? btn.action() : router.push({ name: btn.route })"
      :icon-class="btn.icon"
      :is-active="route.name === btn.route"
      :aria-label="btn.name"
    />
  </nav>
</template>

<script setup lang="ts">
import AppIconBtn from "./app-icon-btn.vue";
import { csvExport } from "@/common/export.ts";
import { openWindowWithBlob } from "@/common/helpers.ts";
import { Route, router } from "@/common/router.ts";
import { useRoute } from "vue-router";

const route = useRoute();

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
  route?: Route;
  action?(): unknown;
}

const buttons: ToolbarButton[] = [
  {
    name: "home",
    icon: "fa-home",
    route: Route.Home,
  },
  {
    name: "source",
    icon: "fa-list-ul",
    route: Route.Source,
  },
  {
    name: "tags",
    icon: "fa-tags",
    route: Route.Tags,
  },
  {
    name: "annotation",
    icon: "fa-pencil-square-o",
    route: Route.Annotation,
  },
  {
    name: "download",
    icon: "fa-download",
    action: save,
  },
];
</script>

<style lang="scss" scoped></style>
