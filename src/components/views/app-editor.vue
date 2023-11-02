<template>
  <h1>Tag content</h1>
  <section class="card">
    <h2>Progress</h2>
    <app-progress
      v-if="processedData?.length"
      :done="progressDone"
      :skipped="progressSkipped"
      :total="processedData?.length"
      aria-hidden="true"
    />
  </section>

  <section class="card" v-resizable.br>
    <h2>Assign tags</h2>
    <div class="border border border-dark-60/60">
      <div
        v-if="availableTags?.length"
        class="title-wrapper w-full flex flex-row flex-wrap space-x-2 p-4"
        aria-label="List of available tags"
        role="radiogroup"
      >
        <app-tag
          @click="currentTag = tag"
          v-for="tag in availableTags"
          :key="tag.name"
          :text="tag.name"
          :hotkey="tag.hotkey"
          :is-active="currentTag.name === tag.name"
          no-close
        />
      </div>
      <app-text-wrapper
        @on-selected="onSelected"
        @delete-tag="deleteTag"
        :data="data"
      />
    </div>

    <div
      class="flex gap-x-2 mt-2"
      aria-label="Navigate thru text lines"
      role="navigation"
    >
      <app-btn
        @click="editPrevLine"
        text="Prev"
        :disabled="!isPrevLineAvailable"
        icon="fa-backward"
      />
      <app-btn
        @click="acceptLine"
        text="Accept"
        icon="fa-check"
        bg-color="bg-emerald-500"
        is-emerald
      />
      <app-btn
        @click="editNextLine"
        :text="isRowTagged() ? 'Next' : 'Skip'"
        :disabled="!isNextLineAvailable"
        icon="fa-forward"
      />
    </div>
    <aside class="help mt-6 text-dark-60 flex items-center gap-x-4">
      <i class="fa fa-question-circle fa-3x text-dark-70"></i>
      <div>
        <p>Single click on a word to tag single word.</p>
        <p>Drag-select several words to tag them.</p>
        <p>
          Click once on existing <mark class="bg-dark-50">mark</mark> to remove
          it.
        </p>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import AppTag from "@/components/app-tag.vue";
import { onMounted, ref, watch } from "vue";
import AppBtn from "@/components/app-btn.vue";
import { STORAGE_KEY } from "@/common/constants.ts";
import { Tag, TaggedGroup } from "@/common/interfaces.ts";
import clone from "lodash/clone";
import {
  extendSelectionToWord,
  getArrNextKey,
  getArrPrevKey,
} from "@/common/helpers.ts";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import AppTextWrapper from "@/components/editor/app-text-wrapper.vue";
import AppProgress from "@/components/editor/app-progress.vue";

const currentTag = ref<Tag | {}>({});

const availableTags = ref<Tag[]>([]);
const data = ref<Array<TaggedGroup | string>>([]);
const rowId = ref<number>(-1);
let processedData: null | string[] = null;
const progressDone = ref(0);
const progressSkipped = ref(0);

const isPrevLineAvailable = ref(false);
const isNextLineAvailable = ref(false);

watch(
  () => rowId.value,
  () => {
    isPrevLineAvailable.value = processedData
      ? getArrPrevKey(processedData, rowId.value) !== null
      : false;
    isNextLineAvailable.value = processedData
      ? getArrNextKey(processedData, rowId.value) !== null
      : false;

    progressDone.value =
      Object.keys(
        JSON.parse(localStorage.getItem(STORAGE_KEY.TAGGED_DATA) || "{}"),
      )?.length || 0;
    progressSkipped.value =
      JSON.parse(localStorage.getItem(STORAGE_KEY.SKIPPED_DATA) || "{}")
        ?.length || 0;
  },
);

const isOccupied = (i: number) => {
  return isObject(data.value[i]) || undefined === data.value[i];
};

const onSelected = async () => {
  await extendSelectionToWord();

  const sel = document.getSelection();
  const startId = +sel?.anchorNode?.parentElement?.dataset?.id;
  const endId = +sel?.focusNode?.parentElement?.dataset?.id;

  if (isOccupied(startId) || isOccupied(endId)) {
    sel?.empty();
    return;
  }

  const sentenceData: Record<number, TaggedGroup> = {};

  if (startId === endId) {
    const i = startId;
    sentenceData[i] = clone(currentTag.value);
    sentenceData[i].range = [startId, endId];
    sentenceData[i].isSingle = startId === endId;
    sentenceData[i].text = sel?.toString() || "";

    data.value[i] = sentenceData[i];
  } else {
    const range = Array.from(
      { length: endId - startId + 1 },
      (_, index) => index + startId,
    );

    sentenceData[startId] = {};
    for (const i of range) {
      sentenceData[startId][i] = clone(currentTag.value);
      sentenceData[startId][i].range = [startId, endId];
      sentenceData[startId][i].isSingle = startId === endId;
      sentenceData[startId][i].text = data.value[i];
      delete data.value[i];
    }

    data.value[startId] = sentenceData[startId];
  }

  sel.empty();
};

const deleteTag = (e: number) => {
  const group: TaggedGroup | string = data.value[e];
  if (isObject(group) && group.isSingle) {
    const wordId = group.range[0];
    data.value[wordId] = group.text;
  } else {
    for (const wordId in group) {
      data.value[wordId] = group[wordId].text;
    }
  }
};

const acceptLine = () => {
  const savedData = JSON.parse(
    localStorage.getItem(STORAGE_KEY.TAGGED_DATA) || "{}",
  );
  savedData[rowId.value] = data.value;
  localStorage.setItem(STORAGE_KEY.TAGGED_DATA, JSON.stringify(savedData));

  editNextLine();
};

const isRowTagged = () =>
  data.value.some((row: string | Record<string, unknown>) => isObject(row));

const saveRowAsSkipped = () => {
  const skippedArr = JSON.parse(
    localStorage.getItem(STORAGE_KEY.SKIPPED_DATA) || "[]",
  );
  skippedArr.push(rowId.value);
  const skippedData = [...new Set(skippedArr)];

  console.log(">>skippedData", skippedData);

  localStorage.setItem(STORAGE_KEY.SKIPPED_DATA, JSON.stringify(skippedData));
};

const editNextLine = () => {
  if (isNextLineAvailable.value) {
    if (!isRowTagged()) {
      console.log("Row is not tagged! Skip");
      saveRowAsSkipped();
    }

    rowId.value = getArrNextKey(processedData, rowId.value);
    localStorage.setItem(STORAGE_KEY.ROW_ID, rowId.value);

    loadData();
  }
};

const editPrevLine = () => {
  if (isPrevLineAvailable.value) {
    rowId.value = getArrPrevKey(processedData, rowId.value);
    localStorage.setItem(STORAGE_KEY.ROW_ID, rowId.value);

    loadData();
  }
};

const loadData = () => {
  if (!isEmpty(processedData[rowId.value])) {
    data.value = processedData[rowId.value].split(" ");
  }

  const taggedData = JSON.parse(
    localStorage.getItem(STORAGE_KEY.TAGGED_DATA) || "{}",
  );
  if (!isEmpty(taggedData[rowId.value])) {
    taggedData[rowId.value].forEach((element, index) => {
      if (isEmpty(element)) {
        delete taggedData[rowId.value][index];
      }
    });

    data.value = taggedData[rowId.value];
  }
};

const processSourceData = () => {
  processedData = JSON.parse(
    localStorage.getItem(STORAGE_KEY.PROCESSED_SOURCE),
  );

  rowId.value = +localStorage.getItem(STORAGE_KEY.ROW_ID) || 0;
  localStorage.setItem(STORAGE_KEY.ROW_ID, rowId.value);

  const taggedData = JSON.parse(
    localStorage.getItem(STORAGE_KEY.TAGGED_DATA) || "{}",
  );
  if (!isEmpty(taggedData[rowId.value])) {
    taggedData[rowId.value].forEach((element, index) => {
      if (isEmpty(element)) {
        delete taggedData[rowId.value][index];
      }
    });

    return taggedData[rowId.value];
  }

  if (!isEmpty(processedData[rowId.value])) {
    return processedData[rowId.value].split(" ");
  }
};

onMounted(() => {
  availableTags.value = JSON.parse(
    localStorage.getItem(STORAGE_KEY.TAGS) || "[]",
  );
  data.value = processSourceData();
  if (availableTags.value?.length) {
    currentTag.value = availableTags.value[0];
  }

  console.log("Current row id: " + rowId.value);
});
</script>

<style lang="scss" scoped></style>
