<template>
  <div
    class="min-h-[30px] bg-transparent active:bg-dark-100 hover:border-dark-50 text-dark-50 relative inline-flex items-center px-3 text-lg border border-dark-60 rounded-full uppercase cursor-pointer transition-all"
    :class="{ active: isActive }"
    :aria-label="`Tag: ${text}, hotkey: ${hotkey}`"
    role="radio"
    @keyup="action"
    tabindex="0"
  >
    <div class="text-base font-bold" v-text="text" />
    <div
      v-if="hotkey?.length"
      class="hotkey text-sm text-white ml-2 pl-2 border-l-2 border-white/20"
      :class="{ activeSub: isActive }"
      v-text="hotkey"
    />
    <div
      v-if="!noClose"
      class="close ml-2 min-w-[22px] text-right border-l-2 border-white/20"
      @click.stop="$emit('delete')"
      aria-label="Delete Tag"
      role="button"
    >
      <i class="fa fa-close text-dark-50" :class="{ activeSub: isActive }"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { KEY_CODE } from "@/common/constants.ts";

defineProps<{
  text: string;
  hotkey: string | undefined;
  isActive?: boolean;
  noClose?: boolean;
}>();

const emit = defineEmits(["delete", "click"]);

const action = (e: KeyboardEvent) => {
  if (KEY_CODE.DELETE === e.code) {
    emit("delete");
  } else if ([KEY_CODE.ENTER, KEY_CODE.SPACE].includes(e.code)) {
    emit("click");
  }
};
</script>

<style lang="scss" scoped>
.active {
  @apply text-dark-400 bg-amber-500/80 hover:bg-amber-500/100 border-transparent;
}
.activeSub {
  @apply text-dark-400;
}
</style>
