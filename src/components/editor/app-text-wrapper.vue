<template>
  <div
    v-if="data?.length"
    class="text-wrapper p-4 text-xl flex flex-wrap bg-dark-50/80 text-dark-500"
    @mouseup="$emit('onSelected')"
    aria-label="Container for clickable and selectable words"
    role="main"
    tabindex="0"
  >
    <template v-for="(word, j) in data" :key="j">
      <template v-if="isTagged(j)">
        <template v-if="(data[j] as TaggedGroup).isSingle">
          <app-mark @click="$emit('delete-tag', j)">
            <app-word
              :text="(word as TaggedGroup).text"
              :tag="data[j]"
              :data-id="j"
              marked
            />
            <app-inline-tag :text="(word as TaggedGroup).name" />
          </app-mark>
        </template>
        <template v-else>
          <app-mark @click="$emit('delete-tag', j)">
            <app-word
              v-for="(subword, y) in data[j] as TaggedGroup"
              :key="y"
              :text="(subword as unknown as TaggedGroup).text"
              :data-id="y"
              marked
            />
            <app-inline-tag
              :text="((data[j] as TaggedData)[j] as TaggedGroup).name"
            />
          </app-mark>
        </template>
      </template>
      <app-word v-else :text="word as string" :tag="data[j]" :data-id="j" />
    </template>
  </div>
</template>
<script setup lang="ts">
import isEmpty from "lodash/isEmpty";
import AppMark from "@/components/editor/app-mark.vue";
import AppWord from "@/components/editor/app-word.vue";
import AppInlineTag from "@/components/editor/app-inline-tag.vue";
import { isString } from "lodash";
import { TaggedData, TaggedGroup } from "@/common/interfaces.ts";

const props = defineProps<{
  data: TaggedData;
}>();

const isTagged = (i: number) => {
  return !(isString(props.data[i]) || isEmpty(props.data[i]));
};
</script>
<style lang="scss" scoped></style>
