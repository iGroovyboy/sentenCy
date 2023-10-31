<template>
  <div>
    <h1>Attach tags</h1>
    <app-progress
      v-if="processedData?.length"
      class="max-w-3xl"
      :done="rowId + 1"
      :total="processedData?.length"
    />
    <div class="border max-w-3xl">
      <div
        v-if="availableTags?.length"
        class="title-wrapper w-full flex flex-row flex-wrap bg-blue-950"
      >
        <app-tag
          @click="currentTag = tag"
          v-for="tag in availableTags"
          :key="tag.name"
          :text="tag.name"
          :hotkey="tag.hotkey"
          :is-active="currentTag.name === tag.name"
        />
      </div>
      <app-text-wrapper
        @on-selected="onSelected"
        @delete-tag="deleteTag"
        :data="data"
      />
    </div>

    <div class="flex space-x-2">
      <app-btn
        @click="editPrevLine"
        text="Prev"
        :disabled="!isPrevLineAvailable"
        icon="fa-backward"
      />
      <app-btn @click="acceptLine" text="Accept" icon="fa-check" />
      <app-btn
        @click="editNextLine"
        text="Skip"
        :disabled="!isNextLineAvailable"
        icon="fa-forward"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTag from "@/components/editor/app-tag.vue";
import { onMounted, reactive, ref, watch } from "vue";
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

  console.log(">>>", data.value);
  console.log(sentenceData);
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

const editNextLine = () => {
  if (isNextLineAvailable.value) {
    console.log("is next line avaiable: true", rowId.value);
    rowId.value = getArrNextKey(processedData, rowId.value);
    localStorage.setItem(STORAGE_KEY.ROW_ID, rowId.value);

    loadData();
  }
};

const editPrevLine = () => {
  if (isPrevLineAvailable.value) {
    console.log("is prev line avaiable: true", rowId.value);
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
    console.log("OK", processedData[rowId.value].split(" "));
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
  rowId.value = 0;
});
</script>

<style lang="scss" scoped>
.text-wrapper {
  background-color: #b7b7b7;
  resize: vertical;
}
</style>
