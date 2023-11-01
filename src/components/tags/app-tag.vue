<template>
  <div
    class="min-h-[30px] bg-transparent active:bg-dark-100 hover:border-dark-50 text-dark-50 relative flex items-center px-3 text-lg border border-dark-60 rounded-full uppercase cursor-pointer transition-all"
    :class="{ active: isActive }"
  >
    <div class="text-base font-bold" v-text="text" />
    <div
      v-if="hotkey.length"
      class="hotkey text-sm text-white ml-2 pl-2 border-l-2 border-white/20"
      :class="{ activeSub: isActive }"
      v-text="hotkey"
    />
    <div
      v-if="!noClose"
      class="close ml-2 min-w-[22px] text-right border-l-2 border-white/20"
      @click.stop="$emit('delete')"
    >
      <i class="fa fa-close text-dark-50" :class="{ activeSub: isActive }"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  hotkey: string;
  isActive?: boolean;
  noClose?: boolean;
}>();
</script>

<style lang="scss" scoped>
.active {
  @apply text-dark-400 bg-amber-500/80 hover:bg-amber-500/100 border-transparent;
}
.activeSub {
  @apply text-dark-400;
}
</style>
