<template>
  <h1>Edit tags</h1>
  <section class="card" v-resizable.br>
    <aside>
      <app-dropzone
        text="Drop file or click to import tags"
        @load="importData"
      />
    </aside>
    <div class="form my-4">
      <div class="input group">
        <span class="text-dark-60 group-hover:text-dark-50">Tag name*:</span>
        <input
          @keydown="tagChange($event)"
          v-model="currentTag.name"
          type="text"
          ref="tagInput"
          required
          aria-required="true"
          aria-label="Tag name"
        />
      </div>
      <div class="input group">
        <span class="text-dark-60 group-hover:text-dark-50">Hotkey:</span>
        <input
          @keydown="hotkeyChange($event)"
          v-model="currentTag.hotkey"
          type="text"
          aria-label="Tag hotkey"
        />
      </div>
      <div class="flex gap-x-2 items-center mt-4">
        <app-btn
          @click="clearInputs"
          :disabled="!(canSaveTag || hasDataInFields)"
          icon="fa-eraser"
          text="New"
        />
        <app-btn
          v-if="canSaveTag"
          @click="saveTag"
          icon="fa-save"
          text="Save"
        />
        <app-btn
          v-else
          @click="add"
          icon="fa-plus"
          text="Add"
          :disabled="!hasDataInFields"
        />
        <app-divider mx="mx-4" />
        <app-btn
          @click="exportTagsJson"
          text="Export"
          icon="fa-download"
          pos="end"
          :disabled="!tags.length"
        />
      </div>
    </div>
    <div
      class="tags-list mt-4 p-4 flex flex-row flex-wrap gap-x-2 border border-dark-60/60"
      aria-label="List of tags"
      role="radiogroup"
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
    <app-btn-next
      class="mt-2"
      :nextScreen="SCREEN.EDITOR"
      :disabled="!tags.length"
    />
  </section>
</template>

<script setup lang="ts">
import AppBtn from "@/components/app-btn.vue";
import { computed, onMounted, reactive, ref } from "vue";
import AppTag from "@/components/app-tag.vue";
import clone from "lodash/clone";
import isEmpty from "lodash/isEmpty";
import AppDropzone from "@/components/app-dropzone.vue";
import { SCREEN } from "@/common/screens.ts";
import AppBtnNext from "@/components/app-btn-next.vue";
import { STORAGE_KEY } from "@/common/constants.ts";
import AppDivider from "@/components/app-divider.vue";
import { openWindowWithBlob } from "@/common/helpers.ts";
import { Tag } from "@/common/interfaces.ts";

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

const hasDataInFields = computed(
  () => currentTag.name.length || currentTag.hotkey.length,
);

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

const clearInputs = () => {
  currentTag.name = "";
  currentTag.hotkey = "";
};

const exportTagsJson = () => {
  if (tags.value.length) {
    openWindowWithBlob(JSON.stringify(tags.value));
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
    @apply bg-transparent border font-bold text-dark-50 border-dark-70 hover:border-dark-60 focus-visible:border-amber-500 outline-0 p-2 px-4 uppercase;
  }
}
</style>
