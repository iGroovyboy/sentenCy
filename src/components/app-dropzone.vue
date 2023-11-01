<template>
  <div
    class="dropzone my-4"
    v-bind="getRootProps()"
    :aria-label="'Drop zone: ' + text"
    role="button"
  >
    <div
      class="bg-transparent border-2 border-amber-500 border-dashed text-amber-500 text-center p-2 px-6"
      :class="{ active: isDragActive }"
    >
      <input v-bind="getInputProps()" aria-hidden="true" />
      <p v-text="text"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDropzone } from "vue3-dropzone";
import { reactive } from "vue";
import { ALLOWED_FILE_TYPES } from "@/common/constants.ts";

const props = defineProps<{ text: string }>();
const emit = defineEmits(["load"]);

const state = reactive({
  files: [],
});

const onDrop = (acceptFiles, rejectReasons) => {
  console.log(acceptFiles);
  console.log(rejectReasons);

  state.files = acceptFiles.filter((f) => ALLOWED_FILE_TYPES.includes(f.type));

  const reader = new FileReader();

  reader.onload = () => {
    const contents = reader.result;
    emit("load", contents);
  };

  reader.readAsText(state.files[0]);
};

const { getRootProps, getInputProps, isDragActive, ...rest } = useDropzone({
  onDrop,
});

const handleClickDeleteFile = (index) => {
  state.files.splice(index, 1);
};
</script>

<style lang="scss" scoped>
.active {
  @apply border-2 border-solid bg-amber-500 text-black;
}
</style>
