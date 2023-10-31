<template>
  <span class="uppercase mx-2 text-blue-500 font-bold" v-text="text" />
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<style lang="scss" scoped></style>
