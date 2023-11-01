<template>
  <span
    class="word mx-1 bg-transparent cursor-pointer"
    :class="{ hovers: !marked }"
    v-text="text"
    role="button"
    tabindex="0"
  />
</template>

<script setup lang="ts">
defineProps<{ text: string; marked?: boolean }>();
</script>

<style lang="scss" scoped>
.hovers {
  @apply hover:bg-dark-50 active:bg-transparent;
}
</style>
