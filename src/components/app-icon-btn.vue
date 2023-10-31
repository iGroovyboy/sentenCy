<template>
  <button class="mb-4">
    <i
      class="fa fa-2x text-stone-400"
      :class="[icon, { active: isActive }]"
    ></i>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ iconClass: string; isActive?: boolean }>();

const icon = computed(() => props.iconClass || "fa-bicycle");
</script>

<style lang="scss" scoped>
.active {
  @apply text-amber-400;
}
</style>
