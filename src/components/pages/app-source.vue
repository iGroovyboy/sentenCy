<template>
  <h1>Source data</h1>
  <section class="card" v-resizable.br>
    <aside>
      <app-dropzone text="Drop file or click to import" @load="importData" />
    </aside>
    <textarea
      v-model="data"
      @input="updateData"
      class="w-full min-h-[400px] bg-dark-200 border border-dark-70 hover:border-dark-60 outline-0 focus:border-amber-500 p-1 text-dark-50 transition-all"
      name="source"
      aria-label="Source text"
    ></textarea>
    <div class="flex flex-row justify-between">
      <app-btn icon="fa-eraser" text="Clear" @click="data = ''" />
      <app-btn-next :nextScreen="Route.Tags" :disabled="!data.length" />
    </div>
  </section>
</template>

<script setup lang="ts">
import AppBtnNext from "@/components/app-btn-next.vue";
import AppDropzone from "@/components/app-dropzone.vue";
import { onMounted, ref } from "vue";
import { STORAGE_KEY } from "@/common/constants.ts";
import AppBtn from "@/components/app-btn.vue";
import { Route } from "@/common/router.ts";
import storage from "localstorage-slim";

const data = ref("");

const importData = (content: string) => {
  data.value = content;
  updateData();
};

const prepareSourceData = (data: string): string[] => {
  return data
    .split(/\r?\n/)
    .map((r) => r.trim())
    .filter((r) => r);
};

const updateData = () => {
  storage.set(STORAGE_KEY.SOURCE, data.value);

  storage.set(STORAGE_KEY.PROCESSED_SOURCE, prepareSourceData(data.value));
};

onMounted(() => {
  data.value = storage.get(STORAGE_KEY.SOURCE) || "";
});
</script>

<style lang="scss" scoped></style>
