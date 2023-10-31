<template>
  <div
    class="bg-transparent text-black flex m-2 px-3 text-lg font-bold border rounded-md uppercase cursor-pointer"
    :class="{ active: isActive }"
  >
    <div class="text" v-text="text" />
    <div
      v-if="hotkey.length"
      class="hotkey text-sm text-white ml-1"
      v-text="hotkey"
    />
    <div class="close ml-4" @click.stop="$emit('delete')">
      <i class="fa fa-close"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; hotkey: string; isActive?: boolean }>();
</script>

<style lang="scss" scoped>
.active {
  @apply text-white bg-blue-950 border-blue-950;
}
</style>
