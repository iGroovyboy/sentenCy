<template>
  <div>
    <h1>Source data</h1>
    <app-dropzone text="Drop file or click to import" @load="importData" />
    <textarea
      v-model="data"
      @input="updateData"
      class="w-full min-h-[400px]"
      name="source"
    ></textarea>
    <div class="flex flex-row justify-between">
      <app-btn icon="fa-eraser" text="Clear" @click="data = ''" />
      <app-btn-next :nextScreen="SCREEN.TAGS" :disabled="!data.length" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBtnNext from "@/components/app-btn-next.vue";
import { SCREEN } from "@/common/screens.ts";
import AppDropzone from "@/components/app-dropzone.vue";
import { onMounted, ref } from "vue";
import { STORAGE_KEY } from "@/common/constants.ts";
import AppBtn from "@/components/app-btn.vue";
import { incrStringVersion, jenkinsHash } from "@/common/helpers.ts";
import isEmpty from "lodash/isEmpty";

const data = ref("");

const importData = (content) => {
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
  localStorage.setItem(STORAGE_KEY.SOURCE, data.value);

  localStorage.setItem(
    STORAGE_KEY.PROCESSED_SOURCE,
    JSON.stringify(prepareSourceData(data.value)),
  );
};

onMounted(() => {
  data.value = localStorage.getItem(STORAGE_KEY.SOURCE) || "";
});
</script>

<style lang="scss" scoped>
textarea {
  background-color: #b7b7b7;
}
</style>
