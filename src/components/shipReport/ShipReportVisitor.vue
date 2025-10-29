<script setup>
import { useShipParticipants } from "@/composables/shipReport/useShipParticipants";
import { Dialog } from "primevue";
import { ref } from "vue";

const { reportId, report, type } = defineProps({
  reportId: String,
  report: Object,
  type: String,
});

const {
  shipReportStore,
  formData,
  getOptions,
  inputFields,
  openEditDialog,
  openDeleteDialog,
  handleUpdate,
  handleDelete,
  visibleEdit,
  visibleDelete,
  selectedVisitor,
  updateFields,
} = useShipParticipants(reportId);
</script>

<template>
  <div class="space-y-6 text-sm pt-2" v-if="report?.[type]?.length">
    <div v-for="(visit, key) in report[type]" :key="key">
      <div class="flex justify-between">
        <div class="space-y-2">
          <span class="grid grid-cols-1 text-neutral-500">
            Full Name & Rank:
            <h1>
              {{ visit.first_name }} {{ visit.last_name }} | {{ visit.rank }}
            </h1>
          </span>
          <span class="grid grid-cols-1 text-neutral-500">
            Company:
            <h1>{{ visit.company }}</h1>
          </span>
        </div>
        <div class="space-x-3">
          <Button
            icon="pi pi-pencil"
            severity="secondary"
            size="small"
            variant="outlined"
            @click="openEditDialog(visit)"
          />
          <Button
            icon="pi pi-trash"
            severity="danger"
            size="small"
            variant="outlined"
            @click="openDeleteDialog(visit)"
          />
        </div>
      </div>
      <Divider />
    </div>
  </div>
  <p v-else>No {{ type.toLowerCase() }}s found.</p>

  <!-- Edit Dialog -->
  <Dialog
    v-model:visible="visibleEdit"
    modal
    header="Edit Participant"
    :style="{ width: '30rem' }"
  >
    <div class="space-y-4">
      <div class="space-y-1" v-for="field in updateFields" :key="field.key">
        <label :for="field.key" class="font-semibold">{{ field.label }}</label>

        <InputText
          v-if="field.type === 'text' || field.type === 'number'"
          v-model="formData[field.model]"
          :placeholder="field.placeholder"
          class="w-full"
        />

        <Select
          v-else-if="field.type === 'selection'"
          v-model="formData[field.model]"
          :options="getOptions(field)"
          optionLabel="name"
          optionValue="value"
          :placeholder="field.placeholder"
          class="w-full"
        />

        <MultiSelect
          v-else-if="field.type === 'multiselect'"
          v-model="formData[field.model]"
          display="chip"
          :options="getOptions(field)"
          optionLabel="name"
          class="w-full"
        />
      </div>
    </div>
    <div class="flex justify-end gap-2 pt-6">
      <Button
        label="Cancel"
        severity="secondary"
        @click="visibleEdit = false"
      />
      <Button label="Update" severity="success" @click="handleUpdate" />
    </div>
  </Dialog>

  <!--  Delete Dialog -->
  <Dialog
    v-model:visible="visibleDelete"
    modal
    header="Confirm Delete"
    :style="{ width: '25rem' }"
  >
    <p>
      Are you sure you want to delete <b>{{ selectedVisitor?.first_name }}</b
      >?
    </p>
    <div class="flex justify-end gap-2 pt-6">
      <Button
        label="Cancel"
        severity="secondary"
        @click="visibleDelete = false"
      />
      <Button
        label="Delete"
        severity="danger"
        :loading="shipReportStore.operation.loading"
        :disabled="shipReportStore.operation.loading"
        @click="handleDelete"
      />
    </div>
  </Dialog>
</template>
