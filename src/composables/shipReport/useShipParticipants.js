import { useShipReportStore } from "@/stores/shipReportStore";
import { reactive, ref, watch, computed, nextTick, onMounted } from "vue";

export function useShipParticipants(reportId, report, type) {
  const shipReportStore = useShipReportStore();

  const visibleParticipant = ref(false);
  const showPersonSelect = ref(false);
  const showManualAdd = ref(false);

  const showRemoveAllDialog = ref(false);
  const showRetainDialog = ref(false);

  const selectedVisitors = ref([]);

  const removeAllPartiLoading = computed(() =>
    shipReportStore.isLoading("remove-all-participant")
  );

  const addVisitorLoading = computed(() =>
    shipReportStore.isLoading("add-participant")
  );

  const retainVisitorLoading = computed(() =>
    shipReportStore.isLoading("retain-selected-participants")
  );

  const formData = reactive({
    company: null,
    participant: [],
    first_name: "",
    last_name: "",
    rank: "",
  });

  const resetForm = () => {
    formData.company = null;
    formData.participant = [];
    formData.first_name = "";
    formData.last_name = "";
    formData.rank = "";
    showPersonSelect.value = false;
    showManualAdd.value = false;
  };

  watch(visibleParticipant, (val) => {
    if (!val) resetForm();
  });

  onMounted(async () => {
    await shipReportStore.fetchCompanies();
  });

  watch(
    () => formData.company,
    async (companyName) => {
      if (companyName) {
        await shipReportStore.fetchParticipantsByCompany(companyName);
      }
    }
  );

  onMounted(async () => {
    await shipReportStore.fetchCompanies();
  });

  watch(
    () => formData.company,
    (newVal) => {
      showPersonSelect.value = !!newVal;
      if (!newVal) {
        formData.participant = [];
        showManualAdd.value = false;
      } else {
        formData.participant = formData.participant.filter((val) => {
          const p = participantList.value.find((x) => x.value === val);
          return p && p.company.toLowerCase() === newVal.toLowerCase();
        });
      }
    }
  );

  const participantList = ref([]);

  const addManualToList = () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) return;

    const fullName =
      `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim();
    const exists = shipReportStore.participants.find(
      (p) => p.name.toLowerCase() === fullName.toLowerCase()
    );
    if (exists) return;

    const newParticipant = {
      name: fullName,
      value: fullName.toLowerCase().replace(/\s+/g, "_"),
      first_name: formData.first_name,
      last_name: formData.last_name,
      rank: formData.rank,
      isNew: true,
      company: formData.company,
    };

    shipReportStore.participants.push(newParticipant);
    formData.participant.push(newParticipant.value);

    formData.first_name = "";
    formData.last_name = "";
    formData.rank = "";
    showManualAdd.value = false;
  };

  const getOptions = (field) => {
    switch (field.model) {
      case "company":
        return shipReportStore.companies;
      case "participant":
        return shipReportStore.participants;
      default:
        return [];
    }
  };
  const canSubmit = computed(() => {
    if (showManualAdd.value) {
      return (
        formData.company &&
        formData.first_name.trim() &&
        formData.last_name.trim()
      );
    } else {
      return formData.company && formData.participant.length > 0;
    }
  });

  const handleSubmit = async () => {
    const payload = {
      merge_participants: true,
      participants: [],
    };

    // Build payload based on selected participants' ids
    formData.participant.forEach((val) => {
      const participant = shipReportStore.participants.find(
        (p) => p.value === val
      );
      if (!participant) return;

      const [first, last] = participant.name.split(" ");
      payload.participants.push({
        first_name: first,
        last_name: last || "",
        rank: participant.rank || "",
        company: formData.company,
        roles: ["visitor"],
      });
    });

    // Send the payload to the backend to add participants
    await shipReportStore.addParticipant(reportId, payload);

    // Reset form data
    formData.company = null;
    formData.participant = [];
    formData.first_name = "";
    formData.last_name = "";
    formData.rank = "";
    showPersonSelect.value = false;
    showManualAdd.value = false;

    visibleParticipant.value = false;
  };

  const openAddDialog = () => {
    Object.keys(formData).forEach((k) => {
      formData[k] = Array.isArray(formData[k]) ? [] : "";
    });
    formData.company = null;
    showPersonSelect.value = false;
    showManualAdd.value = false;
    visibleParticipant.value = true;
  };

  // const removeManualFromList = (participant) => {
  //   participantList.value = participantList.value.filter(
  //     (p) => p.value !== participant.value
  //   );

  //   // Also deselect if it was already selected
  //   formData.participant = formData.participant.filter(
  //     (p) => p.value !== participant.value
  //   );
  // };

  // const openRemoveAllDialog = () => {
  //   showRemoveAllDialog.value = true;
  // };

  const confirmRemoveAll = async () => {
    console.log("All visitors removed");

    await shipReportStore.removeAllParticipant(reportId);
    showRemoveAllDialog.value = false;
  };

  const openRetainDialog = async () => {
    showRetainDialog.value = true;

    await nextTick();

    const visitors = report?.[type] || [];

    selectedVisitors.value = [...visitors];
  };

  const confirmRetainSelected = async () => {
    const retainedIds = selectedVisitors.value.map((v) => v.id);

    const payload = {
      participants: retainedIds.map((id) => ({
        id,
        roles: ["visitor"],
      })),
    };

    await shipReportStore.retainSelectedParticipants(reportId, payload);

    showRetainDialog.value = false;
    selectedVisitors.value = [];
  };

  return {
    formData,
    getOptions,
    handleSubmit,
    openAddDialog,
    showPersonSelect,
    showManualAdd,
    visibleParticipant,
    canSubmit,
    shipReportStore,
    addManualToList,
    // removeManualFromList,
    resetForm,
    showRemoveAllDialog,
    confirmRemoveAll,
    removeAllPartiLoading,
    addVisitorLoading,
    showRetainDialog,
    openRetainDialog,
    selectedVisitors,
    confirmRetainSelected,
    retainVisitorLoading,
  };
}
