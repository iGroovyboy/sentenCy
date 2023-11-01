<template>
  <h1 class="normal-case text-amber-400">sentenCy</h1>
  <section class="card">
    <p>
      This is a simple
      <app-tag hotkey="tool" text="annotation" is-active /> tool originally made
      for <a href="https://spacy.io/" target="_blank">spaCy</a>.
    </p>
    <p>
      It allows loading of raw text data, tagging words in sentences (attaching
      named entitites) and exporting it as CSV.
    </p>
    <p>Basically, it replaces excel tables and manual columns labeling.</p>
  </section>

  <section class="card">
    <h2><i class="fa fa-list-ul mr-2 text-dark-60"></i> Sources</h2>
    <p>
      Begin with loading (or directly pasting) your text data at
      <mark>sources</mark> page.
    </p>
  </section>

  <section class="card">
    <h2><i class="fa fa-tags mr-2 text-dark-60"></i> Tags</h2>
    <p>
      You will have to enter (or import JSON) <mark>tags</mark> data and
      optionally define <mark>hotkeys</mark> if you prefer more manual control.
    </p>
  </section>

  <section class="card">
    <h2><i class="fa fa-edit mr-2 text-dark-60"></i> Annotation</h2>
    <p>
      Here is the main part of this place: you annotate your text line by line
      clicking or selecting words and tags.
    </p>
  </section>

  <section class="card">
    <h2><i class="fa fa-edit mr-2 text-dark-60"></i> Export</h2>
    <p>
      Open prepared data as
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
      with all it's pros and cons. One of the possible limitations is the size
      of data you can save.
    </p>
    <p>This is a free and experimental tool, no warranties.</p>
  </section>
</template>

<script setup lang="ts">
import AppTag from "@/components/app-tag.vue";
</script>

<style lang="scss" scoped>
mark {
  @apply px-1 bg-amber-300/80;
}
</style>
