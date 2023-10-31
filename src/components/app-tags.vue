<template>
  <h1>Edit tags</h1>
  <app-dropzone text="Drop file or click to import tags" @load="importData" />
  <div class="form">
    <div class="input">
      <span for="">Tag name*:</span>
      <input
        @keydown="tagChange($event)"
        v-model="currentTag.name"
        type="text"
        ref="tagInput"
      />
    </div>
    <div class="input">
      <span for="">Hotkey:</span>
      <input
        @keydown="hotkeyChange($event)"
        v-model="currentTag.hotkey"
        type="text"
      />
    </div>
  </div>
  <div class="flex space-x-2">
    <app-btn v-if="canSaveTag" @click="saveTag" icon="fa-plus" text="Save" />
    <app-btn v-else @click="add" icon="fa-plus" text="Add" />
    <app-btn
      @click="exportTagsJson"
      text="Export"
      icon="fa-download"
      pos="end"
      :disabled="!tags.length"
    />
  </div>

  <div
    class="tags-list bgc-g mt-4 flex flex-row flex-wrap max-w-3xl border border-neutral-400 rounded-md"
  >
    <app-tag
      @click="editTag(tag)"
      @delete="deleteTag(tag)"
      v-for="tag in tags"
      :key="tag.name"
      :text="tag.name"
      :hotkey="tag.hotkey"
      :is-active="currentTag.name === tag.name"
    />
  </div>
  <app-btn-next :nextScreen="SCREEN.EDITOR" :disabled="!tags.length" />
</template>

<script setup lang="ts">
import AppBtn from "@/components/app-btn.vue";
import { computed, onMounted, reactive, ref } from "vue";
import AppTag from "@/components/tags/app-tag.vue";
import clone from "lodash/clone";
import isEmpty from "lodash/isEmpty";
import AppDropzone from "@/components/app-dropzone.vue";
import { SCREEN } from "@/common/screens.ts";
import AppBtnNext from "@/components/app-btn-next.vue";
import { STORAGE_KEY } from "@/common/constants.ts";

const currentTag = reactive<Tag | {}>({
  name: "",
  hotkey: "",
});
const tags = ref<Tag[] | []>([]);
const tagInput = ref<null | HTMLInputElement>(null);

const isTagExists = computed(() => {
  return !isEmpty(
    tags.value.find((t) => {
      return t.name.toLowerCase() === currentTag.name.toLowerCase();
    }),
  );
});
const canSaveTag = computed(() => {
  const isCurrentTagExist = !!currentTag.name?.length;
  return isCurrentTagExist && isTagExists.value;
});

const tagChange = (e) => {
  if (e.keyCode === 13) {
    add();
  }
};

const hotkeyChange = (e) => {
  if (e.keyCode === 13) {
    tagInput.value.focus();
    add();
  }
};

const updateStorage = () => {
  localStorage.setItem(STORAGE_KEY.TAGS, JSON.stringify(tags.value));
};

const deleteTag = (tag: Tag) => {
  console.log("delete");
  tags.value = tags.value.filter((t) => {
    return t.name.toLowerCase() !== tag.name.toLowerCase();
  });
  updateStorage();
};

const saveTag = () => {
  if (!canSaveTag.value) {
    return;
  }

  const tag = tags.value.find((t) => {
    return t.name === currentTag.name;
  });
  tag.name = currentTag.name;
  tag.hotkey = currentTag.hotkey;

  updateStorage();
};

const add = () => {
  if (!currentTag.name.length) {
    return;
  }

  if (!isTagExists.value) {
    tags.value.push(clone(currentTag));
    currentTag.name = "";
    currentTag.hotkey = "";
    updateStorage();
  }
};

const editTag = (tag: Tag) => {
  currentTag.name = tag.name;
  currentTag.hotkey = tag.hotkey;
};

const exportTagsJson = () => {
  if (tags.value.length) {
    const data = [JSON.stringify(tags.value)];
    const blob = new Blob(data, { type: "text/json" });
    window.open(URL.createObjectURL(blob));
  }
};

const importData = (content: string) => {
  tags.value = JSON.parse(content);
  updateStorage();
};

onMounted(() => {
  tags.value = JSON.parse(localStorage.getItem(STORAGE_KEY.TAGS) || "[]");
});
</script>

<style lang="scss" scoped>
.input {
  @apply flex items-center mb-2 text-white;

  span {
    min-width: 100px;
  }

  input {
    @apply text-black p-2 px-4 uppercase;
  }
}
</style>
