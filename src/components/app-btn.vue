<template>
  <div :class="['', alignmentClass]" :aria-label="text">
    <button
      @click.self="!disabled && $emit('click')"
      class="p-2 px-6 transition-all group"
      :class="[{ disabled: disabled }, bgClasses]"
    >
      <span class="pr-2 uppercase" v-text="text" />
      <i
        v-if="icon.length"
        class="fa group-active:text-amber-300 transition-all"
        :class="icon"
      ></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text: string;
  icon: string;
  disabled?: boolean;
  pos?: string;
  isEmerald?: boolean;
}>();

const defaultColorClasses = "bg-amber-500/80 hover:bg-amber-500/100";
const emeraldColorClasses = "bg-emerald-500/80 hover:bg-emerald-500/100";

const bgClasses = computed(() =>
  props.isEmerald ? emeraldColorClasses : defaultColorClasses,
);

const alignmentClass = computed(() => {
  if (props.pos?.length) {
    return "flex justify-" + props.pos;
  }
});
</script>

<style lang="scss" scoped>
.disabled {
  background-color: grey;
}
</style>
