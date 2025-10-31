<script setup>
import { useShipReport } from "@/composables/shipReport/useShipReport";
import PrimeDataTable from "@/components/dataTable/PrimeDataTable.vue";
import { useShipReportStore } from "@/stores/shipReportStore";
import { useDataTableHandler } from "@/composables/dataTable/useDataTableHandler";
import { usePersonStore } from "@/stores/personStore";
import { usePerson } from "@/composables/persons/usePerson";
import AddRecordModal from "@/components/modals/AddRecordModal.vue";
import { useRouter } from "vue-router";
import EditRecordModal from "@/components/modals/EditRecordModal.vue";
import { ref } from "vue";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal.vue";

const personStore = usePersonStore();
const {
  personCols,
  personDatas,
  addPersonInputFields,
  addPerson,
  updatePersonInputFields,
} = usePerson();
const router = useRouter();

const showEditModal = ref(false);
const selectedPerson = ref(null);
const showDeleteDialog = ref(false);
const personToDelete = ref(null);

const { onPage, onSearch } = useDataTableHandler(personStore, "fetchPersons");

const handleEdit = (row) => {
  selectedPerson.value = { ...row };
  showEditModal.value = true;
};

const handleUpdate = async (payload) => {
  console.log("Updated payload:", payload);
  const id = payload.id;
  await personStore.updatePerson(id, payload);
  showEditModal.value = false;
};

const handleDelete = (row) => {
  personToDelete.value = row;
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (personToDelete.value?.id) {
    await personStore.deletePerson(personToDelete.value.id);
  }
  showDeleteDialog.value = false;
};

const personActionHandlers = {
  getItems(row) {
    return [
      {
        label: "Actions",
        items: [
          {
            label: "View Details",
            icon: "pi pi-eye",
            command: () =>
              router.push({ name: "PersonView", params: { id: row.id } }),
          },
          {
            label: "Edit",
            icon: "pi pi-pencil",
            command: () => handleEdit(row),
          },
          {
            label: "Delete",
            icon: "pi pi-trash",
            command: () => handleDelete(row),
          },
        ],
      },
    ];
  },
};
</script>

<template>
  <div class="w-full h-screen">
    <div class="card w-full h-full">
      <div>
        <PrimeDataTable
          tableName="Persons"
          :loading="personStore.loading || personStore.operation.loading"
          :rowData="personDatas"
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
          :actionHandlers="personActionHandlers"
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
