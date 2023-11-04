<template>
  <div class="flex justify-end">
    <app-btn
      @click.capture.stop="action"
      :text="title"
      icon="fa-arrow-right"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AppBtn from "@/components/app-btn.vue";
import { Route, router } from "@/common/router.ts";

const props = defineProps<{
  nextScreen: Route;
  disabled?: boolean;
  text?: string;
}>();

const title = computed(() => props.text || "NEXT");

const action = () => {
  if (props.disabled) {
    return;
  }

  router.push({ name: props.nextScreen });
};
</script>

<style lang="scss" scoped></style>
