<script setup>
import { defineProps, defineEmits, watch, ref } from "vue";

const props = defineProps({
  success: Boolean,
  title: { type: String, default: "Success" },
  message: {
    type: String,
    default: "Your report has been submitted successfully.",
  },
});

const visible = ref(false);
let timer = null;

const handleClose = () => {
  visible.value = false;
};

// watch([() => props.success], ([loading]) => {
//   visible.value = loading;
//   if (loading) {
//     timer = setTimeout(() => {
//       visible.value = false;
//     }, 2000);
//   } else {
//     clearTimeout(timer);
//   }
// });
</script>

<template>
  <Dialog
    v-model:visible="visible"
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

    <div class="flex flex-col items-center justify-center py-2 space-y-4">
      <i
        key="icon"
        class="pi pi-check-circle text-green-500"
        style="font-size: 3rem"
      ></i>

      <p class="text-gray-600 text-sm text-center leading-snug">
        {{ message }}
      </p>

      <Button
        label="OK"
        severity="success"
        class="mt-2"
        size="small"
        @click="handleClose"
      />
    </div>
  </Dialog>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
