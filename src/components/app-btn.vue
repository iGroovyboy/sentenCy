<template>
  <div :class="['', alignmentClass]">
    <button
      @click.self="!disabled && $emit('click')"
      class="bg-amber-500/80 hover:bg-amber-500/100 text-black p-2 px-6 transition-all"
      :class="{ disabled: disabled }"
    >
      <span class="pr-2 uppercase" v-text="text" />
      <i v-if="icon.length" class="fa" :class="icon"></i>
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
}>();

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
