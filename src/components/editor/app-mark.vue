<template>
  <mark class="bg-amber-300 cursor-pointer relative group">
    <slot></slot>
    <div
      class="icon absolute top-[-2px] right-[-2px] bg-white w-4 h-4 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-80"
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
