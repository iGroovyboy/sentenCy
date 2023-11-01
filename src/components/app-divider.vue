<template>
  <div
    class="flex w-0.5 h-8 bg-dark-70 rounded-full"
    :class="mx"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
const props = defineProps<{ mx?: string }>();
</script>

<style lang="scss" scoped></style>
