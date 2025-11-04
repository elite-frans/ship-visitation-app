<script setup>
import { useShipReport } from "@/composables/shipReport/useShipReport";
import PrimeDataTable from "@/components/dataTable/PrimeDataTable.vue";
import { useShipReportStore } from "@/stores/shipReportStore";
import { useDataTableHandler } from "@/composables/dataTable/useDataTableHandler";
import { usePersonStore } from "@/stores/personStore";
import { usePerson } from "@/composables/persons/usePerson";
import AddRecordModal from "@/components/modals/AddRecordModal.vue";
import EditRecordModal from "@/components/modals/EditRecordModal.vue";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal.vue";

const personStore = usePersonStore();
const {
  personCols,
  personDatas,
  addPersonInputFields,
  addPerson,
  updatePersonInputFields,
  showEditModal,
  selectedPerson,
  showDeleteDialog,
  personToDelete,
  handleUpdate,
  confirmDelete,
  colActionHandlers,
} = usePerson();

const { onPage, onSearch } = useDataTableHandler(personStore, "fetchPersons");
</script>

<template>
  <div class="w-full h-screen">
    <div class="card w-full h-full">
      <div>
        <PrimeDataTable
          tableName="Persons"
          :loading="personStore.loading || personStore.operation.loading"
          :rowData="personStore.data"
          :colData="personCols"
          :total="personStore.total"
          :perPage="personStore.perPage"
          :page="personStore.page"
          :headerButton="{
            component: AddRecordModal,
            props: {
              fields: addPersonInputFields,
            },
            on: {
              create: addPerson,
            },
          }"
          :actionHandlers="colActionHandlers"
          @page="onPage"
        />

        <EditRecordModal
          v-model="showEditModal"
          :record="selectedPerson"
          :fields="updatePersonInputFields"
          title="Edit Person"
          @update="handleUpdate"
        />
        <DeleteConfirmModal
          v-model="showDeleteDialog"
          :recordName="
            personToDelete?.values?.first_name +
            ' ' +
            personToDelete?.values?.last_name
          "
          title="Delete Person"
          @confirm="confirmDelete"
        />
      </div>
    </div>
  </div>
</template>
