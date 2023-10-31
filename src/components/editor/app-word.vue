<template>
  <span class="word mx-1" v-text="text" />
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<style lang="scss" scoped></style>
