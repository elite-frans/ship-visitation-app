<script setup>
import { ref, reactive, watch } from "vue";
import { useConfirm } from "primevue/useconfirm";

const data = reactive({});
const visible = ref(null);

const confirm = useConfirm();
const emit = defineEmits(["create"]);

const EmitData = async () => {
  emit("create", data);
};

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    default: "Create Record",
  },
  options: {
    type: Array,
    default: null,
  },
  optionMulti: {
    type: Object,
    default: null
  },
  errorMessages: {
    type: [Array, Object],
    default: () => ({}),
  },
});

const onShow = () => {
  props.fields.forEach((field) => {
    data[field.model] = field.default ?? null;
  });
  visible.value = true;
};

watch(
    [() => props.fields],
    ([newFields]) => {
      const initial = {};
      newFields.forEach((field) => {
        initial[field.model] = field.default ?? null;
      });
      data.value = initial;
    },
    { immediate: true }
);

const confirmCreate = () => {
  visible.value = false;
  confirm.require({
    group: "create",
    message: "Are you sure you want to proceed?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Save",
    },
    accept: () => {
      EmitData();
    },
    reject: () => {
      visible.value = true;
    },
  });
};
</script>

<template>
  <div>
    <Button
        label="Create"
        icon="pi pi-plus"
        severity="success"
        size="small"
        @click="onShow"
    />

    <Dialog
        v-model:visible="visible"
        modal
        :header="title"
        :dismissableMask="true"
        class="w-full max-w-lg"
    >
      <form @submit.prevent="confirmCreate">
        <div class="space-y-6 grid">
          <div v-for="field in fields" :key="field.model">
            <p v-if="field.required" class="font-semibold mb-1">
              {{ field.label }} <span class="text-red-500">*</span>
            </p>
            <p v-else class="font-semibold mb-1">{{ field.label }}</p>

            <InputText
                v-if="field.type === 'text' || field.type === 'number'"
                v-model="data[field.model]"
                :type="field.type"
                class="w-full"
                :required="field.required ?? false"
                :readonly="field.readonly ?? false"
                :invalid="!!errorMessages?.[field.key]"
            />

            <Textarea
                v-else-if="field.type === 'textarea'"
                v-model="data[field.model]"
                row="5"
                class="w-full"
                autoResize
                :required="field.required ?? false"
                :readonly="field.readonly ?? false"
                :invalid="!!errorMessages?.[field.key]"
            />

            <Select
                v-else-if="field.type === 'select'"
                v-model="data[field.model]"
                :options="field?.options || props?.options || props?.optionMulti[field?.option_key] || []"
                :optionLabel="field.option_label || 'label'"
                :optionValue="field.option_value || 'value'"
                :placeholder="field.placeholder"
                class="w-full"
                checkmark
                filter
                :required="field.required ?? false"
                :invalid="!!errorMessages?.[field.key]"
                :virtualScrollerOptions="{ itemSize: 38 }"
            />

            <div v-else-if="field.type === 'radiobutton'" class="flex gap-5">
              <div>
                <RadioButton
                    inputId="active"
                    v-model.number="data[field.model]"
                    :value="1"
                />
                <label for="active"> Active </label>
              </div>
              <div>
                <RadioButton
                    inputId="inactive"
                    v-model.number="data[field.model]"
                    :value="0"
                />
                <label for="inactive"> Inactive </label>
              </div>
            </div>

            <InputText
                v-else
                v-model="data[field.model]"
                type="text"
                class="w-full"
            />

            <!-- Validation Error Message -->
            <div v-if="errorMessages && errorMessages[field.key]">
              <p
                  v-for="(err, index) in errorMessages[field.key]"
                  :key="index"
                  class="text-xs text-red-500"
              >
                {{ err }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex gap-5 justify-end mt-5">
          <Button
              label="Cancel"
              severity="secondary"
              @click="visible = false"
          />
          <Button label="Submit" type="submit" severity="success" />
        </div>
      </form>
    </Dialog>

    <ConfirmDialog group="create" :closable="false" />
  </div>
</template>

<style scoped lang="scss"></style>