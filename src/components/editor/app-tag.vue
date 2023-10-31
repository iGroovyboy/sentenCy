<template>
  <div
    class="bg-transparent text-white flex m-2 px-3 text-lg font-bold border rounded-md uppercase cursor-pointer"
    :class="{ active: isActive }"
  >
    <div class="text" v-text="text" />
    <div class="hotkey" v-text="hotkey" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; hotkey: string; isActive?: boolean }>();
</script>

<style lang="scss" scoped>
.active {
  @apply text-blue-950 bg-white;
}
</style>
