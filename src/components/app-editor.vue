<template>
  <div>
    <h1>Attach tags</h1>
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
        :data="data"
        :sentence-data="sentenceData"
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
import { Tag } from "@/common/interfaces.ts";
import clone from "lodash/clone";
import {
  extendSelectionToWord,
  getArrNextKey,
  getArrPrevKey,
} from "@/common/helpers.ts";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import AppTextWrapper from "@/components/editor/app-text-wrapper.vue";

const currentTag = ref("");

const availableTags = ref<Tag>([]);
const data = ref([]);
const sentenceData = reactive({});
const rowId = ref<null | number>(null);
let processedData: null | any[] = null;

const isPrevLineAvailable = ref(false);
const isNextLineAvailable = ref(false);

watch(
  () => rowId.value,
  () => {
    isPrevLineAvailable.value =
      getArrPrevKey(processedData, rowId.value) !== null;
    isNextLineAvailable.value =
      getArrNextKey(processedData, rowId.value) !== null;

    console.log("WATCH rowId", rowId.value);
    console.log(isPrevLineAvailable.value, isNextLineAvailable.value);
  },
);

const isOccupied = (i: number) => {
  return isObject(data[i]) || undefined === data[i];
};

const onSelected = async () => {
  await extendSelectionToWord();

  const sel = document.getSelection();
  const startId = +sel?.anchorNode?.parentElement?.dataset?.id;
  const endId = +sel?.focusNode?.parentElement?.dataset?.id;

  if (isOccupied(startId) || isOccupied(endId)) {
    sel.empty();
    return;
  }

  if (startId === endId) {
    const i = startId;
    sentenceData[i] = clone(currentTag.value);
    sentenceData[i].range = [startId, endId];
    sentenceData[i].isSingle = startId === endId;
    sentenceData[i].text = sel.toString();

    data[i] = sentenceData[i];
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
      delete data[i];
    }

    data[startId] = sentenceData[startId];
  }

  sel.empty();

  console.log(">>>", data.value);
  console.log(sentenceData);
  console.log(data);
};

const acceptLine = () => {
  const savedData = JSON.parse(
    localStorage.getItem(STORAGE_KEY.TAGGED_DATA) || "{}",
  );
  savedData[rowId.value] = data;
  localStorage.setItem(STORAGE_KEY.TAGGED_DATA, JSON.stringify(savedData));

  console.log("accept?");

  editNextLine();
};

const editNextLine = () => {
  console.log(
    isNextLineAvailable.value,
    getArrNextKey(processedData, rowId.value),
  );
  if (isNextLineAvailable.value) {
    console.log("is next line avaiable: true", rowId.value);
    rowId.value = getArrNextKey(processedData, rowId.value);
    localStorage.setItem(STORAGE_KEY.ROW_ID, rowId.value);

    console.log("new row", rowId.value);

    if (!isEmpty(processedData[rowId.value])) {
      data.value = processedData[rowId.value].split(" ");
    }
  }
};

const editPrevLine = () => {
  console.log(
    isPrevLineAvailable.value,
    getArrPrevKey(processedData, rowId.value),
  );
  if (isPrevLineAvailable.value) {
    console.log("is prev line avaiable: true", rowId.value);
    rowId.value = getArrPrevKey(processedData, rowId.value);
    localStorage.setItem(STORAGE_KEY.ROW_ID, rowId.value);

    console.log("new row", rowId.value);

    if (!isEmpty(processedData[rowId.value])) {
      data.value = processedData[rowId.value].split(" ");
    }
  }
};

const processSourceData = () => {
  if (localStorage.length) {
  }
  processedData = JSON.parse(
    localStorage.getItem(STORAGE_KEY.PROCESSED_SOURCE),
  );

  rowId.value = +localStorage.getItem(STORAGE_KEY.ROW_ID) || 0;
  localStorage.setItem(STORAGE_KEY.ROW_ID, rowId.value);

  if (!isEmpty(processedData[rowId.value])) {
    return processedData[rowId.value].split(" ");
  }

  // TODO
  return data[0].split(" ");
};

onMounted(() => {
  availableTags.value =
    JSON.parse(localStorage.getItem(STORAGE_KEY.TAGS)) || [];
  data.value = processSourceData();
  if (availableTags.value?.length) {
    currentTag.value = availableTags.value[0];
  }
  rowId.value = rowId.value ?? 0;
});
</script>

<style lang="scss" scoped>
.text-wrapper {
  background-color: #b7b7b7;
  resize: vertical;
}
</style>
