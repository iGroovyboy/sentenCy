<template>
  <div class="flex justify-end">
    <app-btn
      @click.capture.stop="action"
      :text="title"
      icon="fa-arrow-right"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import useMain from "@/store/use_main";
import { computed } from "vue";
import AppBtn from "@/components/app-btn.vue";

const props = defineProps<{
  nextScreen: number;
  disabled?: boolean;
  text?: string;
}>();
const mainStore = useMain();

const title = computed(() => props.text || "NEXT");

const action = () => {
  if (props.disabled) {
    return;
  }

  mainStore.setScreen(props.nextScreen);
};
</script>

<style lang="scss" scoped></style>
