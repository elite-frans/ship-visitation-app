<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  loading: Boolean,
  title: {
    type: String,
    default: "Submitting",
  },
});

const isLoading = ref(false);

watch(
  [() => props.loading],
  ([loading]) => {
    isLoading.value = loading;
  },
  { immediate: true }
);
</script>

<template>
  <Dialog
    v-model:visible="isLoading"
    modal
    :closable="false"
    :draggable="false"
    :blockScroll="true"
    class="rounded-2xl"
    :style="{ width: '22rem' }"
  >
    <template #header>
      <div class="w-full text-center">
        <h2 class="text-lg font-semibold text-gray-700">
          {{ title }}
        </h2>
      </div>
    </template>

    <div class="flex flex-col items-center justify-center py-6 space-y-4">
      <ProgressSpinner
        style="width: 60px; height: 60px"
        strokeWidth="6"
        fill="transparent"
        animationDuration=".8s"
        aria-label="Submitting"
      />

      <p class="text-gray-600 text-sm text-center leading-snug">
        Please wait while we process your submission.<br />
        This may take a few seconds.
      </p>
    </div>
  </Dialog>
</template>
