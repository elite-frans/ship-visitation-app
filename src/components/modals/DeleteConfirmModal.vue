<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  recordName: {
    type: String,
    default: "this record",
  },
  title: {
    type: String,
    default: "Confirm Deletion",
  },
  message: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const visible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => (visible.value = val)
);

watch(visible, (val) => emit("update:modelValue", val));

const confirmDelete = () => {
  emit("confirm");
  visible.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :header="title"
    :style="{ width: '25rem' }"
  >
    <div class="flex flex-col gap-4">
      <p>
        {{ message || `Are you sure you want to delete ${recordName}? This action cannot be undone.` }}
      </p>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" @click="visible = false" />
        <Button label="Delete" severity="danger" @click="confirmDelete" />
      </div>
    </div>
  </Dialog>
</template>
