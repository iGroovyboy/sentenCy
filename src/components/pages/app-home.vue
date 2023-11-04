<template>
  <h1 class="normal-case text-amber-400">sentenCy</h1>
  <section class="card">
    <p>
      This is a simple
      <app-tag hotkey="tool" text="annotation" is-active role="presentation" />
      originally made to work along with
      <a href="https://spacy.io/" target="_blank">spaCy</a>.
    </p>
    <p>
      It allows for the loading of raw text data, tagging words in sentences
      (attaching named entities), and exporting it as a CSV.
    </p>
    <p>Basically, it replaces excel tables and manual columns labeling.</p>
  </section>

  <section class="card">
    <h2><i class="fa fa-list-ul mr-2 text-dark-60"></i> Source</h2>
    <p>
      Begin by loading (or directly pasting) your text data on the
      <router-link :to="{ name: Route.Source }">Source</router-link> page.
    </p>
  </section>

  <section class="card">
    <h2><i class="fa fa-tags mr-2 text-dark-60"></i> Tags</h2>
    <p>
      You will have to enter <mark>tag</mark> data (or import JSON) and
      optionally define <mark>hotkeys</mark> if you prefer more manual control.
    </p>
  </section>

  <section class="card">
    <h2><i class="fa fa-edit mr-2 text-dark-60"></i> Annotation</h2>
    <p>
      Here is the main part of this tool: you annotate your text line by line by
      clicking or selecting words and tags.
    </p>
  </section>

  <section class="card">
    <h2><i class="fa fa-edit mr-2 text-dark-60"></i> Export</h2>
    <p>
      Open the prepared data as a
      <a
        href="https://en.wikipedia.org/wiki/Comma-separated_values"
        target="_blank"
        >CSV</a
      >.
    </p>
  </section>

  <section>
    <h2>
      <i class="fa fa-question-circle mr-2 text-dark-60"></i> Keep in mind
    </h2>
    <p>
      All the data you are working on is saved in your browser's
      <a href="https://en.wikipedia.org/wiki/Web_storage" target="_blank"
        >local storage</a
      >
      with all its pros and cons. One of the possible limitations is the size of
      data you can save.
    </p>
    <p>This is a free and experimental tool with no warranties.</p>
  </section>
</template>

<script setup lang="ts">
import AppTag from "@/components/app-tag.vue";
import { Route } from "@/common/router.ts";
</script>

<style lang="scss" scoped>
mark {
  @apply px-1 bg-amber-300/80;
}
</style>
