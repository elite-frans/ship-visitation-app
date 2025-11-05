<script setup>
import { useCreateShipReport } from "@/composables/shipReport/useCreateShipReport";
import { useRouter } from "vue-router";

const { formData, inputFields, orderedFields } = useCreateShipReport();
const router = useRouter();

const goBack = () => {
  router.push({ name: "ShipReport" });
};
</script>

<template>
  <div class="card">
    <div class="w-full h-full">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-bold uppercase">Ship Visiting form:</h1>
          <Button
            label="Back"
            size="small"
            severity="secondary"
            variant="text"
            icon="pi pi-arrow-left"
            @click="goBack"
          />
        </div>
        <Divider />
      </div>

      <!-- Input field Forms -->
      <form class="w-full pt-10">
        <div class="flex flex-col w-full space-y-6">
          <div
            v-for="(item, index) in orderedFields"
            :key="item.key ?? `group-${index}`"
          >
            <!-- Group Header -->
            <template v-if="item.isGroupHeader">
              <h1 class="text-lg font-bold mb-3 border-b pb-1">
                {{ item.name }}
              </h1>
            </template>

            <!-- Field Input -->
            <template v-else>
              <div
                class="grid grid-cols-1 space-y-1 mb-2 md:grid-cols-2 md:items-center md:mb-0"
              >
                <label class="font-medium text-neutral-500"
                  >{{ item.label }}:
                </label>

                <!-- Text / Number -->
                <InputText
                  v-if="['text', 'number'].includes(item.type)"
                  v-model="formData[item.model]"
                  :type="item.type"
                  class="w-full"
                  :required="item.required ?? false"
                />

                <!-- Date Range -->
                <DatePicker
                  v-else-if="item.type === 'datePickerRange'"
                  fluid
                  v-model="formData[item.model]"
                  selectionMode="range"
                  class="w-full"
                  :manualInput="false"
                />

                <!-- Date -->
                <DatePicker
                  v-else-if="item.type === 'datePicker'"
                  fluid
                  v-model="formData[item.model]"
                  class="w-full"
                  :manualInput="false"
                />

                <!-- Select -->
                <Select
                  v-else-if="item.type === 'select'"
                  v-model="formData[item.model]"
                  :options="[]"
                  :placeholder="item.placeholder"
                  class="w-full"
                  checkmark
                  filter
                />
              </div>

              <!-- Divider for ungrouped fields -->
              <div class="mt-1">
                <Divider v-if="!item.group_input" />
              </div>
            </template>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
