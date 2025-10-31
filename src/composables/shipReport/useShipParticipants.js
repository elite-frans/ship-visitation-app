import { useShipReportStore } from "@/stores/shipReportStore";
import { reactive, ref, watch, computed, nextTick } from "vue";

export function useShipParticipants(reportId) {
  const shipReportStore = useShipReportStore();

  const visibleParticipant = ref(false);
  const showPersonSelect = ref(false);
  const showManualAdd = ref(false);

  const showRemoveAllDialog = ref(false);
  const showRetainDialog = ref(false);

  const selectedVisitors = ref([]);

  const report = ref({
    visitors: [],
  });

  const type = "visitors";

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

  const participantList = ref([
    { name: "John Doe", company: "KRBS", rank: "Master", value: "john_doe" },
    {
      name: "Sarah Smith",
      company: "KRBS",
      rank: "MSI",
      value: "sarah_smith",
    },
    {
      name: "Frank Sinatra",
      company: "Elite",
      rank: "MSI",
      value: "frank_sinatra",
    },
    {
      name: "Magnus Carl",
      company: "Elite",
      rank: "Master",
      value: "magnus Carl",
    },
  ]);

  const companies = ref([
    { name: "KRBS", value: "krbs" },
    { name: "Elite", value: "elite" },
  ]);

  const filteredParticipants = computed(() => {
    if (!formData.company) return [];
    return participantList.value.filter(
      (p) => p.company.toLowerCase() === formData.company.toLowerCase()
    );
  });

  const getOptions = (field) => {
    switch (field.model) {
      case "company":
        return companies.value;
      case "participant":
        return filteredParticipants.value;
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

    // Build payload based on selected participants
    formData.participant.forEach((val) => {
      const participant = participantList.value.find((p) => p.value === val);
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

    await shipReportStore.addParticipant(reportId, payload);

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

  // const addManualToList = () => {
  //   if (!formData.first_name.trim() || !formData.last_name.trim()) return;

  //   const fullName =
  //     `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim();

  //   const exists = participantList.value.some(
  //     (p) => p.name.toLowerCase() === fullName.toLowerCase()
  //   );
  //   if (exists) return;

  //   participantList.value.push({
  //     name: fullName,
  //     value: fullName.toLowerCase().replace(/\s+/g, "_"),
  //     rank: formData.rank,
  //     isNew: true, // ✅ mark as new
  //   });

  //   formData.first_name = "";
  //   formData.last_name = "";
  //   formData.rank = "";

  //   showManualAdd.value = false;
  // };

  const addManualToList = () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) return;
    if (!formData.company) return; // company must be selected

    const fullName =
      `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim();

    const exists = participantList.value.some(
      (p) =>
        p.name.toLowerCase() === fullName.toLowerCase() &&
        p.company.toLowerCase() === formData.company.toLowerCase()
    );
    if (exists) return;

    // ✅ Automatically tie this new participant to the selected company
    participantList.value.push({
      name: fullName,
      value: fullName.toLowerCase().replace(/\s+/g, "_"),
      rank: formData.rank,
      company: formData.company,
      isNew: true,
    });

    formData.first_name = "";
    formData.last_name = "";
    formData.rank = "";
    showManualAdd.value = false;
  };

  const removeManualFromList = (participant) => {
    participantList.value = participantList.value.filter(
      (p) => p.value !== participant.value
    );

    // Also deselect if it was already selected
    formData.participant = formData.participant.filter(
      (p) => p.value !== participant.value
    );
  };

  // const openRemoveAllDialog = () => {
  //   showRemoveAllDialog.value = true;
  // };

  const confirmRemoveAll = async () => {
    console.log("All visitors removed");

    await shipReportStore.removeAllParticipant(reportId);
    showRemoveAllDialog.value = false;
  };

  // const openRetainDialog = async () => {
  //   showRetainDialog.value = true;

  //   await nextTick();

  //   const visitors =
  //     report?.visitors || report?.participants || report?.[report.type] || [];

  //   if (visitors.length) {
  //     selectedVisitors.value = visitors.map((v) => v.id);
  //   }
  // };

  const openRetainDialog = async () => {
    showRetainDialog.value = true;

    await nextTick(); // wait until dialog renders

    // get visitors array safely
    const visitors =
      report?.visitors || report?.participants || report?.[type] || [];

    // pre-select all visitor IDs after the DOM renders
    if (visitors.length) {
      selectedVisitors.value = visitors.map((v) => v.id);
    }
  };

  const confirmRetainSelected = async () => {
    const retainedIds = selectedVisitors.value;
    console.log("retainedIds:", retainedIds);

    const visitors = report?.visitors || report?.[type] || [];
    console.log("visitors:", visitors);

    // Create one participant object per selected ID
    const payload = {
      participants: retainedIds.map((id) => ({
        id,
        roles: ["visitor"],
      })),
    };

    console.log("Retain payload:", payload);

    await shipReportStore.retainSelectedParticipants(reportId, payload);
    showRetainDialog.value = false;
    selectedVisitors.value = "";
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
    removeManualFromList,
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
