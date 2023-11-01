<template>
  <mark
    class="relative mx-1 bg-amber-300/90 hover:bg-amber-300/100 cursor-pointer group transition-all"
  >
    <slot></slot>
    <div
      class="icon absolute top-[-2px] right-[-2px] bg-white w-4 h-4 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-80 transition-all"
    >
      <i class="fa fa-close text-center"></i>
    </div>
  </mark>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
i {
  font-size: 0.7em;
}
</style>
