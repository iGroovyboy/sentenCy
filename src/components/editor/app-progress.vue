<template>
  <div class="progress flex w-full h-6 border border-amber-500 my-1 relative">
    <div class="bar bg-amber-500" />
    <div
      class="absolute leading-1 font-bold text-sm text-white text-shadow-1 ml-1"
      v-text="details"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

const props = defineProps<{
  text?: string;
  total: number;
  done?: number;
}>();

const details = computed(() => {
  const numbers = +props.done + " / " + props.total;
  const prefix = props.text || "";
  return prefix + numbers;
});

const width = computed(() => {
  return (props.done / props.total) * 100 + "%";
});
</script>

<style lang="scss" scoped>
.bar {
  width: v-bind("width");
}
</style>
