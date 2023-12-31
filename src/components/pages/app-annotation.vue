<template>
  <h1>Tag content</h1>
  <section v-if="!isEditorAvailable" class="card">
    <h2>No valid data</h2>
    <p>Please, first load some text on the Sources page.</p>
    <p>Then create some tags.</p>
  </section>

  <section v-if="isEditorAvailable" class="card">
    <h2>Progress</h2>
    <app-progress
      v-if="processedData?.length"
      :done="progressDone"
      :skipped="progressSkipped"
      :total="processedData?.length"
      aria-hidden="true"
    />
  </section>

  <section v-if="isEditorAvailable" class="card" v-resizable.br>
    <h2>Assign tags</h2>
    <div class="border border border-dark-60/60">
      <div
        v-if="availableTags?.length"
        class="title-wrapper w-full flex flex-row flex-wrap gap-x-2 gap-y-2 p-4"
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
        <p>Single click on a word to tag it.</p>
        <p>Drag-select several words to tag them.</p>
        <p>
          Click once on an existing <mark class="bg-dark-50">mark</mark> to
          remove it.
        </p>
      </div>
    </aside>
  </section>
</template>

<script setup lang="ts">
import AppTag from "@/components/app-tag.vue";
import { computed, onMounted, ref, watch } from "vue";
import AppBtn from "@/components/app-btn.vue";
import { STORAGE_KEY } from "@/common/constants.ts";
import {
  SkippedData,
  StoredTaggedData,
  Tag,
  TaggedData,
  TaggedDataItem,
  TaggedGroup,
  TaggedWords,
} from "@/common/interfaces.ts";
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
import storage from "localstorage-slim";
import { useHotkey } from "@/common/use_hotkey.ts";

const currentTag = ref<Tag>({
  name: "",
});

const availableTags = ref<Tag[]>([]);
const data = ref<TaggedData>([]);
const rowId = ref<number>(-1);
let processedData: null | string[] = null;
const progressDone = ref(0);
const progressSkipped = ref(0);

const isPrevLineAvailable = ref(false);
const isNextLineAvailable = ref(false);

const isEditorAvailable = computed(
  () => !(isEmpty(data.value) && isEmpty(availableTags.value)),
);

watch(
  () => rowId.value,
  () => {
    isPrevLineAvailable.value = processedData
      ? getArrPrevKey(processedData, rowId.value) !== null
      : false;
    isNextLineAvailable.value = processedData
      ? getArrNextKey(processedData, rowId.value) !== null
      : false;

    progressDone.value = storage.get(STORAGE_KEY.TAGGED_DATA)
      ? Object.keys(storage.get(STORAGE_KEY.TAGGED_DATA) || {}).length
      : 0;
    progressSkipped.value = storage.get(STORAGE_KEY.SKIPPED_DATA)
      ? (storage.get(STORAGE_KEY.SKIPPED_DATA) as SkippedData).length
      : 0;
  },
);

const isOccupied = (i: number) => {
  return isObject(data.value[i]) || undefined === data.value[i];
};

const onSelected = async () => {
  await extendSelectionToWord();

  const sel = document.getSelection();
  const startId = sel?.anchorNode?.parentElement?.dataset?.id
    ? +sel?.anchorNode?.parentElement?.dataset?.id
    : null;
  const endId = sel?.focusNode?.parentElement?.dataset?.id
    ? +sel?.focusNode?.parentElement?.dataset?.id
    : null;

  if (!startId || !endId) {
    return;
  }

  if (isOccupied(startId) || isOccupied(endId)) {
    sel?.empty();
    return;
  }

  const sentenceData: TaggedDataItem = {};

  if (startId === endId) {
    const i = startId;
    sentenceData[i] = {
      ...clone(currentTag.value),
      range: [startId, endId],
      isSingle: startId === endId,
      text: sel?.toString() || "",
    };

    data.value[i] = sentenceData[i];
  } else {
    const range = Array.from(
      { length: endId - startId + 1 },
      (_, index) => index + startId,
    );

    (sentenceData[startId] as unknown as TaggedWords) = {};
    for (const i of range) {
      (sentenceData[startId] as unknown as TaggedWords)[i] = {
        ...clone(currentTag.value),
        range: [startId, endId],
        isSingle: startId === endId,
        text: data.value[i].toString(),
      };
    }

    data.value[startId] = sentenceData[startId];
  }

  sel?.empty();
};

const deleteTag = (e: number) => {
  const group: TaggedDataItem = data.value[e];
  if (
    isObject(group) &&
    "isSingle" in (group as TaggedGroup) &&
    (group as TaggedGroup).isSingle
  ) {
    const wordId = (group as TaggedGroup).range[0];
    data.value[wordId] = (group as TaggedGroup).text;
  } else {
    for (const wordId in group as TaggedWords) {
      data.value[wordId] = (group as TaggedWords)[wordId].text;
    }
  }
};

const acceptLine = () => {
  const savedData: StoredTaggedData =
    storage.get(STORAGE_KEY.TAGGED_DATA) || {};
  savedData[rowId.value] = data.value;
  storage.set(STORAGE_KEY.TAGGED_DATA, savedData);

  editNextLine();
};

const isRowTagged = () =>
  data.value?.some((row: string | Record<string, unknown>) => isObject(row));

const saveRowAsSkipped = () => {
  const skippedArr: SkippedData = storage.get(STORAGE_KEY.SKIPPED_DATA) || [];
  skippedArr.push(rowId.value);
  const skippedData = [...new Set(skippedArr)];

  storage.set(STORAGE_KEY.SKIPPED_DATA, skippedData);
};

const editNextLine = () => {
  if (isNextLineAvailable.value) {
    if (!isRowTagged()) {
      console.log("Row is not tagged! Skip");
      saveRowAsSkipped();
    }

    // TODO: refactor to use one func with editPrevLine
    if (processedData?.length) {
      const nextKey = getArrNextKey(processedData, rowId.value);
      if (nextKey) {
        rowId.value = getArrNextKey(processedData, rowId.value) || rowId.value;
        storage.set(STORAGE_KEY.ROW_ID, rowId.value.toString());

        loadData();
      } else {
        console.error(
          "Couldn't get valid 'next' key in array of processed data",
        );
      }
    }
  }
};

const editPrevLine = () => {
  if (isPrevLineAvailable.value) {
    // TODO: refactor to use one func with editNextLine
    if (processedData?.length) {
      const prevKey = getArrPrevKey(processedData, rowId.value);
      if (prevKey !== null && prevKey >= 0) {
        rowId.value = prevKey;
        storage.set(STORAGE_KEY.ROW_ID, rowId.value.toString());

        loadData();
      } else {
        console.error(
          "Couldn't get valid 'prev' key in array of processed data",
        );
      }
    }
  }
};

const loadData = () => {
  if (!isEmpty(processedData?.[rowId.value])) {
    data.value = processedData?.[rowId.value].split(" ") || [];
  }

  const taggedData: StoredTaggedData =
    storage.get(STORAGE_KEY.TAGGED_DATA) || {};
  if (!isEmpty(taggedData[rowId.value])) {
    taggedData[rowId.value].forEach(
      (element: TaggedDataItem, index: number) => {
        if (isEmpty(element)) {
          delete taggedData[rowId.value][index];
        }
      },
    );

    data.value = taggedData[rowId.value];
  }
};

const processSourceData = () => {
  processedData = storage.get(STORAGE_KEY.PROCESSED_SOURCE) || [];

  rowId.value = +(storage.get(STORAGE_KEY.ROW_ID) || 0);
  storage.set(STORAGE_KEY.ROW_ID, rowId.value.toString());

  const taggedData: StoredTaggedData =
    storage.get(STORAGE_KEY.TAGGED_DATA) || {};
  if (!isEmpty(taggedData[rowId.value])) {
    taggedData[rowId.value].forEach(
      (element: TaggedDataItem, index: number) => {
        if (isEmpty(element)) {
          delete taggedData[rowId.value][index];
        }
      },
    );

    return taggedData[rowId.value];
  }

  if (!isEmpty(processedData?.[rowId.value])) {
    return processedData?.[rowId.value].split(" ");
  }
};

const selectTag = (tag: Tag) => {
  currentTag.value = tag;
};

onMounted(() => {
  availableTags.value = storage.get(STORAGE_KEY.TAGS) || [];

  data.value = processSourceData() || [];
  if (availableTags.value?.length) {
    currentTag.value = availableTags.value[0];
  }

  useHotkey(availableTags.value, (tag: Tag) => {
    selectTag(tag);
  });
});
</script>

<style lang="scss" scoped></style>
