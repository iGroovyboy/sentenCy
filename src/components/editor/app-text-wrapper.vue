<template>
  <div
    v-if="data?.length"
    class="text-wrapper p-4 text-xl flex flex-wrap"
    @mouseup="$emit('onSelected')"
  >
    <template v-for="(word, j) in data" :key="j">
      <template v-if="isTagged(j)">
        <template v-if="data[j].isSingle">
          <app-mark @click="$emit('delete-tag', j)">
            <app-word :text="word.text" :tag="data[j]" :data-id="j" />
            <app-inline-tag :text="word.name" />
          </app-mark>
        </template>
        <template v-else>
          <app-mark @click="$emit('delete-tag', j)">
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
</template>
<script setup lang="ts">
import isEmpty from "lodash/isEmpty";
import AppMark from "@/components/editor/app-mark.vue";
import AppWord from "@/components/editor/app-word.vue";
import AppInlineTag from "@/components/editor/app-inline-tag.vue";
import { isString } from "lodash";

const props = defineProps<{ data: [] }>();

const isTagged = (i: number) => {
  return !(isString(props.data[i]) || isEmpty(props.data[i]));
};
</script>
<style lang="scss" scoped>
// TODO: move to tailwind or vars
.text-wrapper {
  background-color: #b7b7b7;
  resize: vertical;
}
</style>
