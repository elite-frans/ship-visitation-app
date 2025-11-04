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
  openEditDialog,
  openDeleteDialog,
  handleUpdate,
  handleDelete,
  visibleEdit,
  visibleDelete,
  selectedVisitor,
  updateFields,
  showRemoveAllDialog,
  confirmRemoveAll,
  removeAllPartiLoading,
  showRetainDialog,
  selectedVisitors,
  confirmRetainSelected,
  openRetainDialog,
  retainVisitorLoading,
} = useShipParticipants(reportId, report, type);
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-end">
      <div class="space-y-1">
        <h1 class="text-sm">Manage Participants:</h1>
        <div class="flex items-center my-3 space-x-4">
          <Button
            :label="`Retain Selected ${type}`"
            icon="pi pi-check-circle"
            size="small"
            variant="outlined"
            severity="contrast"
            @click="openRetainDialog"
          />

          <Button
            label="Remove All Visitors"
            icon="pi pi-user-minus"
            size="small"
            variant="outlined"
            severity="contrast"
            @click="showRemoveAllDialog = true"
          />
        </div>
      </div>
    </div>
    <h1 class="font-bold text-lg">{{ type }} List:</h1>
  </div>
  <div class="space-y-6 text-sm pt-4" v-if="report?.[type]?.length">
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
        <!-- <div class="space-x-3">
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
        </div> -->
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
        size="small"
        severity="secondary"
        @click="visibleEdit = false"
      />
      <Button
        label="Update"
        size="small"
        severity="success"
        @click="handleUpdate"
      />
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
        size="small"
        severity="secondary"
        @click="visibleDelete = false"
      />
      <Button
        label="Delete"
        size="small"
        severity="danger"
        :loading="shipReportStore.operation.loading"
        :disabled="shipReportStore.operation.loading"
        @click="handleDelete"
      />
    </div>
  </Dialog>

  <!-- REMOVE ALL DIALOG -->
  <Dialog v-model:visible="showRemoveAllDialog" modal header="Confirm Removal">
    <div class="p-4">
      <p>
        Are you sure you want to <b>remove all visitors</b>?<br />
        This action cannot be undone.
      </p>

      <div class="flex justify-end gap-3 mt-6">
        <Button
          label="Cancel"
          size="small"
          severity="secondary"
          @click="showRemoveAllDialog = false"
        />
        <Button
          label="Yes, Remove All"
          severity="danger"
          size="small"
          :loading="removeAllPartiLoading"
          :disabled="removeAllPartiLoading"
          @click="confirmRemoveAll"
        />
      </div>
    </div>
  </Dialog>

  <!-- RETAIN VISITORS ALL DIALOG -->
  <Dialog
    v-model:visible="showRetainDialog"
    header="Retain Selected Visitors"
    modal
    :style="{ width: '36rem' }"
  >
    <p class="text-sm mb-3 text-gray-600">
      Select the visitors you want to <b>keep</b>. Unselected ones will be
      removed.
    </p>

    <DataTable
      :value="report?.[type] || []"
      v-model:selection="selectedVisitors"
      dataKey="id"
      selectionMode="checkbox"
      scrollable
      scrollHeight="400px"
    >
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column field="first_name" header="First Name" />
      <Column field="last_name" header="Last Name" />
      <Column field="rank" header="Rank" />
      <Column field="company" header="Company" />
    </DataTable>

    <template #footer>
      <div class="mt-6">
        <Button
          label="Cancel"
          size="small"
          text
          @click="showRetainDialog = false"
        />
        <Button
          label="Keep Selected Visitors"
          severity="danger"
          size="small"
          :loading="retainVisitorLoading"
          :disabled="!selectedVisitors.length || retainVisitorLoading"
          @click="confirmRetainSelected"
        />
      </div>
    </template>
  </Dialog>
</template>
