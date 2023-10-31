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
      <div
        v-if="data?.length"
        class="text-wrapper p-4 text-xl flex flex-wrap"
        @mouseup="selected($event)"
      >
        <template v-for="(word, j) in data" :key="j">
          <template v-if="isTagged(j)">
            <template v-if="data[j].isSingle">
              <app-mark>
                <app-word :text="word.text" :tag="data[j]" :data-id="j" />
                <app-inline-tag :text="word.name" />
              </app-mark>
            </template>
            <template v-else>
              <app-mark>
                <app-word
                  v-for="(subword, y) in data[j]"
                  :key="y"
                  :text="subword.text"
                  :tag="data[j][y]"
                  :data-id="y"
                />
                <app-inline-tag :text="data[j][j].name" />
              </app-mark>
            </template>
          </template>
          <app-word v-else :text="word" :tag="data[j]" :data-id="j" />
        </template>
      </div>
    </div>

    <div class="flex space-x-2">
      <app-btn
        @click="editPrevLine"
        text="Prev"
        :disabled="isPrevLineAvailable"
        icon="fa-backward"
      />
      <app-btn @click="acceptLine" text="Accept" icon="fa-check" />
      <app-btn
        @click="editNextLine"
        text="Skip"
        :disabled="isNextLineAvailable"
        icon="fa-forward"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppTag from "@/components/editor/app-tag.vue";
import { onMounted, reactive, ref } from "vue";
import AppBtn from "@/components/app-btn.vue";
import { STORAGE_KEY } from "@/common/constants.ts";
import { Tag } from "@/common/interfaces.ts";
import AppWord from "@/components/editor/app-word.vue";
import clone from "lodash/clone";
import {
  extendSelectionToWord,
  getArrNextKey,
  getArrPrevKey,
} from "@/common/helpers.ts";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import AppInlineTag from "@/components/editor/app-inline-tag.vue";
import AppMark from "@/components/editor/app-mark.vue";

const currentTag = ref("");

const availableTags = ref<Tag>([]);
const source = ref([]);
let data = [];
const sentenceData = reactive({});
let rowId = 0;
let processedData: any[] = null;

const isTagged = (i: number) => !isEmpty(sentenceData[i]);

const isPrevLineAvailable = () => !!getArrPrevKey(processedData, rowId);

const isNextLineAvailable = () => !!getArrNextKey(processedData, rowId);

const isOccupied = (i: number) => {
  return isObject(data[i]) || undefined === data[i];
};

const selected = async () => {
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
      sentenceData[startId][i].text = source.value[i];
      delete data[i];
    }

    data[startId] = sentenceData[startId];
  }

  sel.empty();

  console.log(">>>", source.value);
  console.log(sentenceData);
  console.log(data);
};

const acceptLine = () => {
  // save data
  const savedData = JSON.parse(
    localStorage.getItem(STORAGE_KEY.TAGGED_DATA) || "{}",
  );
  savedData[rowId] = data;
  localStorage.setItem(STORAGE_KEY.TAGGED_DATA, JSON.stringify(savedData));

  editNextLine();
};

const editNextLine = () => {
  if (isNextLineAvailable()) {
    console.log("is next line avaiable: true", rowId);
    rowId = getArrNextKey(processedData, rowId);
    localStorage.setItem(STORAGE_KEY.ROW_ID, rowId);

    console.log("new row", rowId);

    if (!isEmpty(processedData[rowId])) {
      source.value = processedData[rowId].split(" ");
      data = clone(source.value);

      console.log("done?");
    }
  }
};

const processSourceData = () => {
  if (localStorage.length) {
  }
  processedData = JSON.parse(
    localStorage.getItem(STORAGE_KEY.PROCESSED_SOURCE),
  );

  rowId = +localStorage.getItem(STORAGE_KEY.ROW_ID) || 0;
  localStorage.setItem(STORAGE_KEY.ROW_ID, rowId);

  if (!isEmpty(processedData[rowId])) {
    return processedData[rowId].split(" ");
  }

  // TODO
  return data[0].split(" ");
};

onMounted(() => {
  availableTags.value =
    JSON.parse(localStorage.getItem(STORAGE_KEY.TAGS)) || [];
  source.value = processSourceData();
  data = clone(source.value);
  if (availableTags.value?.length) {
    currentTag.value = availableTags.value[0];
  }

  console.log("MM", source.value);
});
</script>

<style lang="scss" scoped>
.text-wrapper {
  background-color: #b7b7b7;
  resize: vertical;
}
</style>
