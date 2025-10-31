<script setup>
import { ref, watch, reactive } from "vue";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const props = defineProps({
  modelValue: Boolean, // for v-model:show
  fields: {
    type: Array,
    required: true,
  },
  record: {
    type: Object,
    required: true, // the existing data to edit
  },
  title: {
    type: String,
    default: "Edit Record",
  },
});

const emit = defineEmits(["update:modelValue", "update"]);

const visible = ref(props.modelValue);
const formData = reactive({});

// populate initial values
watch(
  () => props.record,
  (val) => {
    if (val) {
      Object.assign(formData, val);
    }
  },
  { immediate: true, deep: true }
);

// sync with parent v-model
watch(visible, (val) => emit("update:modelValue", val));
watch(
  () => props.modelValue,
  (val) => (visible.value = val)
);

const handleUpdate = () => {
  emit("update", { ...formData });
  visible.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="title"
    modal
    class="w-[28rem]"
    :closable="true"
  >
    <div class="flex flex-col gap-4">
      <div
        v-for="field in fields"
        :key="field.key"
        class="flex flex-col gap-1"
      >
        <label :for="field.model" class="text-sm font-medium text-gray-600">
          {{ field.label }}
        </label>
        <InputText
          v-if="field.type === 'text'"
          v-model="formData[field.model]"
          :placeholder="field.placeholder"
          class="w-full"
        />
      </div>
      <div class="flex justify-end gap-2 mt-5">
        <Button
          label="Cancel"
          severity="secondary"
          @click="visible = false"
        />
        <Button
          label="Update"
          severity="success"
          @click="handleUpdate"
        />
      </div>
    </div>
  </Dialog>
</template>
