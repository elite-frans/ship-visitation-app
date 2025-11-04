import { usePersonStore } from "@/stores/personStore";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

export function usePerson() {
  const personStore = usePersonStore();

  const showEditModal = ref(false);
  const selectedPerson = ref(null);
  const showDeleteDialog = ref(false);
  const personToDelete = ref(null);

  const router = useRouter();

  const personCols = [
    {
      field: "first_name",
      header: "First Name",
    },
    {
      field: "last_name",
      header: "Last Name",
    },
    {
      field: "company",
      header: "Company",
    },
    {
      field: "rank",
      header: "Rank",
    },
    {
      field: "actions",
      header: "Actions",
    },
  ];

  const personDatas = [
    {
      id: "d154706a-abd9-46f6-9c4e-1182f77bdc95",
      company: "krbs",
      first_name: "John",
      last_name: "Doe",
      rank: null,
    },
    {
      id: "3470a396-cc15-417e-b882-2395ada2458a",
      company: "Elite",
      first_name: "Sarah",
      last_name: "Connor",
      rank: "Director",
    },
    {
      id: "75729c3b-c3de-4f20-8ad5-251cbdbc4f00",
      company: "elite",
      first_name: "Tra",
      last_name: "John",
      rank: "Master",
    },
    {
      id: "13dd4774-ac78-4ff7-9455-252aac4dd4f3",
      company: "elite",
      first_name: "Magnus",
      last_name: "Carl",
      rank: "Master",
    },
    {
      id: "2d379559-29d2-4e1f-a314-2e13f7ee6dd7",
      company: "krbs",
      first_name: "Beam",
      last_name: "Francis",
      rank: "Master",
    },
    {
      id: "0061e064-3551-4af2-b35a-314f778f459d",
      company: "elite",
      first_name: "Jules",
      last_name: "Narzo",
      rank: "Master",
    },
    {
      id: "422cf5a3-9e46-4f69-bcb3-31e7846aab9c",
      company: "Elite",
      first_name: "H.Kubota",
      last_name: "Doe",
      rank: "MSI",
    },
    {
      id: "c127a563-383f-404f-a401-3793f03bd685",
      company: "elite",
      first_name: "Frank",
      last_name: "Sinatra",
      rank: null,
    },
    {
      id: "e7093d3c-c1dc-45ef-b965-39bec991a5b7",
      company: "KRBS",
      first_name: "N.Pimentel",
      last_name: "Doe",
      rank: "TSI",
    },
    {
      id: "86ddae2e-d7eb-4ec5-9ba4-4c88638c304d",
      company: "krbs",
      first_name: "John",
      last_name: "Doe",
      rank: null,
    },
    {
      id: "7e08c8cf-ce65-42f2-aae3-4df986d3353b",
      company: "elite",
      first_name: "Frank",
      last_name: "Sinatra",
      rank: null,
    },
    {
      id: "8562ecb8-eb21-4051-b8d3-588e53d2a1b4",
      company: "krbs",
      first_name: "John",
      last_name: "Doe",
      rank: "Master",
    },
    {
      id: "1043cd81-d81b-4cbf-a879-5e6ade02ad0f",
      company: "krbs",
      first_name: "Sarah",
      last_name: "Smith",
      rank: "MSI",
    },
    {
      id: "58444bf9-34a2-457d-b179-64708e8ff354",
      company: "elite",
      first_name: "Joe",
      last_name: "Doe",
      rank: "Master",
    },
    {
      id: "1c68f163-08f7-408b-bf8e-665fb0fa8860",
      company: "elite",
      first_name: "Narzo",
      last_name: "juluis",
      rank: "Master",
    },
  ];

  const addPersonInputFields = reactive([
    {
      key: "first_name",
      model: "first_name",
      label: "First name",
      type: "text",
      placeholder: "Enter first name",
      required: true,
    },
    {
      key: "last_name",
      model: "last_name",
      label: "Last name",
      type: "text",
      placeholder: "Enter last name",
      required: true,
    },
    {
      key: "rank",
      model: "rank",
      label: "Rank",
      type: "text",
      placeholder: "Enter rank",
      required: true,
    },
    {
      key: "company",
      model: "company",
      label: "Company",
      type: "text",
      placeholder: "Enter company",
      required: true,
    },
  ]);

  const updatePersonInputFields = reactive([
    {
      key: "first_name",
      model: "first_name",
      label: "First name",
      type: "text",
      placeholder: "Enter first name",
      required: true,
    },
    {
      key: "last_name",
      model: "last_name",
      label: "Last name",
      type: "text",
      placeholder: "Enter last name",
      required: true,
    },
    {
      key: "rank",
      model: "rank",
      label: "Rank",
      type: "text",
      placeholder: "Enter rank",
      required: true,
    },
    {
      key: "company",
      model: "company",
      label: "Company",
      type: "text",
      placeholder: "Enter company",
      required: true,
    },
  ]);

  const addPerson = async (payload) => {
    try {
      await personStore.addPerson({ ...payload });
    } catch (error) {
      console.error("❌ Failed to add person:", error);
      throw error;
    }
  };

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

  const colActionHandlers = {
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

  return {
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
  };
}
