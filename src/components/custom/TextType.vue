<template>
  <TextType
    :text="text"
    class="text-xl text-muted mb-6 dark:text-slate-300"
    :typingSpeed="40"
    :pauseDuration="2000"
    :loop="true"
    :showCursor="true"
    :cursorCharacter="'|'"
  />
</template>

<script setup lang="ts">
import TextType from 'vueBits/TextType/TextType.vue';

defineProps<{
  text: string | string[];
}>();
</script>