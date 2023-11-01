<template>
  <div
    class="min-h-[30px] bg-transparent text-dark-50 relative flex items-center px-3 text-lg border border-dark-60 rounded-full uppercase cursor-pointer"
    :class="{ active: isActive }"
  >
    <div class="text-base font-bold" v-text="text" />
    <div
      v-if="hotkey.length"
      class="hotkey text-sm text-white ml-2 pl-2 border-l-2 border-white/20"
      :class="{ activeSub: isActive }"
      v-text="hotkey"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; hotkey: string; isActive?: boolean }>();
</script>

<style lang="scss" scoped>
.active {
  @apply text-dark-400 bg-amber-500/80 hover:bg-amber-500/100 border-transparent;
}
.activeSub {
  @apply text-dark-400  border-transparent;
}
</style>
