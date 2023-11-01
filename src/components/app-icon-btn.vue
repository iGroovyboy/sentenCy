<template>
  <button class="mb-4">
    <i
      class="fa fa-lg text-dark-50 hover:text-white/60 active:text-white/70 transition-all"
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
  @apply text-amber-500;
}
</style>
