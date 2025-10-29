import { useShipReportStore } from "@/stores/shipReportStore";
import { reactive, ref } from "vue";

export function useShipParticipants(reportId) {
  const visibleEdit = ref(false);
  const visibleDelete = ref(false);
  const selectedVisitor = ref(null);

  const formData = reactive({
    first_name: "",
    last_name: "",
    rank: "",
    company: null,
    roles: [],
  });

  const inputFields = reactive([
    {
      key: "first_name",
      model: "first_name",
      label: "First Name",
      type: "text",
      placeholder: "Enter first name",
      required: true,
    },
    {
      key: "last_name",
      model: "last_name",
      label: "Last Name",
      type: "text",
      placeholder: "Enter last name",
      required: true,
    },
    {
      key: "rank",
      model: "rank",
      label: "Rank",
      type: "text",
      placeholder: "Enter last name",
      required: true,
    },
    {
      key: "company",
      apiKey: "",
      model: "company",
      label: "Company",
      type: "selection",
      placeholder: "Select company",
      required: true,
    },
    {
      key: "roles",
      model: "roles",
      label: "Roles",
      type: "multiselect",
      placeholder: "Select roles",
      required: true,
    },
  ]);

  const updateFields = reactive([
    {
      key: "roles",
      model: "roles",
      label: "Roles",
      type: "multiselect",
      placeholder: "Select roles",
      required: true,
    },
  ]);

  const shipReportStore = useShipReportStore();

  const companies = ref([
    { name: "KRBS", value: "krbs" },
    { name: "Elite", value: "elite" },
  ]);

  const roles = ref([
    { name: "Visitor", value: "visitor" },
    { name: "Interviewer", value: "interviewer" },
  ]);

  const getOptions = (field) => {
    switch (field.model) {
      case "company":
        return companies.value;
      case "roles":
        return roles.value;
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    const payload = {
      merge_participants: true,
      participants: [
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
          rank: formData.rank,
          company: formData.company,
          roles: formData.roles.map((r) => r.value),
        },
      ],
    };

    await shipReportStore.addParticipant(reportId, payload);
  };

  //   const openEditDialog = (visitor) => {
  //     selectedVisitor.value = visitor;

  //     // Prefill formData dynamically
  //     Object.keys(formData).forEach((key) => {
  //       formData[key] = visitor[key] ?? null;
  //     });

  //     visibleEdit.value = true;
  //   };

  const openEditDialog = (visitor) => {
    selectedVisitor.value = visitor;
    formData.roles = visitor.roles?.map((r) => ({ name: r, value: r })) || [];
    visibleEdit.value = true;
  };

  const openDeleteDialog = (visitor) => {
    selectedVisitor.value = visitor;
    visibleDelete.value = true;
  };

  const handleUpdate = async () => {
    const payload = {
      merge_participants: true,
      participants: [
        {
          id: selectedVisitor.value.id,
          roles: formData.roles.map((r) => r.value),
        },
      ],
    };

    console.log("Update Payload:", payload);
    await shipReportStore.addParticipant(reportId, payload);

    visibleEdit.value = false;
  };

  const handleDelete = async () => {
    // TODO: call store.deleteParticipant(props.reportId, selectedVisitor.id)
    console.log("Delete visitor:", selectedVisitor.value);
    visibleDelete.value = false;
  };

  return {
    shipReportStore,
    formData,
    getOptions,
    handleSubmit,
    inputFields,
    openEditDialog,
    openDeleteDialog,
    handleUpdate,
    handleDelete,
    visibleEdit,
    visibleDelete,
    selectedVisitor,
    updateFields,
  };
}
