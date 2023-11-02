<template>
  <div class="progress flex flex-col w-full my-1 relative">
    <ul class="flex flex-row justify-between mb-1">
      <li class="text-dark-50 upp">
        Tagged<span
          class="text-2xl font-bold text-emerald-500 ml-2"
          v-text="done"
        />
      </li>
      <li class="text-dark-50 upp">
        Skipped<span
          class="text-2xl font-bold text-amber-600 ml-2"
          v-text="skipped"
        />
      </li>
      <li class="text-dark-50 upp">
        Total<span
          class="text-2xl font-bold text-dark-50 ml-2"
          v-text="total"
        />
      </li>
    </ul>
    <div class="bar-wrapper flex flex-row w-full border border-dark-60">
      <div class="tagged h-2 bg-emerald-500" />
      <div class="skipped h-2 bg-amber-500" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text?: string;
  total: number;
  done?: number;
  skipped?: number;
}>();

const widthTagged = computed(
  () => ((props?.done || 0) / props.total) * 100 + "%",
);

const widthSkipped = computed(
  () => ((props?.skipped || 0) / props.total) * 100 + "%",
);
</script>

<style lang="scss" scoped>
.tagged {
  width: v-bind("widthTagged");
}
.skipped {
  width: v-bind("widthSkipped");
}
</style>
