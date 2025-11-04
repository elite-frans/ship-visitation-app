import { useShipReportStore } from "@/stores/shipReportStore";
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";

export function useShipReport(reportId, shipReportStore) {
  const visible = ref(false);
  const selectedSection = ref(null);
  const actionType = ref("add");

  const showDeleteDialog = ref(false);
  const rowToDelete = ref(null);

  const newSection = ref({ title: "", details: "" });
  const newCustomSection = ref({ title: "" });
  const editChildren = ref([]);
  const editingChildCode = ref(null);
  const editableChildDetails = ref("");

  const editingSectionCode = ref(null);
  const editableDetails = ref("");

  const router = useRouter();

  const viewReportLoading = computed(() =>
    shipReportStore.isLoading("view-report")
  );

  const updateSectionDescLoading = computed(() =>
    shipReportStore.isLoading("update-section")
  );

  const isLoadingType = (type) => shipReportStore.isLoading(type);

  const addNewSectionInputFields = reactive([
    {
      key: "title",
      model: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      required: true,
      readonly: false,
    },
    {
      key: "details",
      model: "details",
      label: "Details",
      type: "textarea",
      placeholder: "Enter details",
      required: true,
    },
  ]);

  const addCustomSectionInputFields = reactive([
    {
      key: "title",
      model: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      required: true,
      readonly: false,
    },
  ]);

  const updateSectionDetailsInputFields = reactive([
    {
      key: "title",
      model: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      required: true,
      readonly: false,
    },
    {
      key: "details",
      model: "details",
      label: "Details",
      type: "textarea",
      placeholder: "Enter details",
      required: true,
      readonly: true,
    },
  ]);

  const shipReportCol = [
    {
      field: "vessel_name",
      header: "Vessel",
    },
    {
      field: "vessel_flag",
      header: "Flag",
    },
    {
      field: "vessel_type",
      header: "Type",
    },
    {
      field: "vessel_ism_company",
      header: "ISM Company",
    },
    {
      field: "vessel_management_office",
      header: "Management",
    },
    {
      field: "visitation_port_name",
      header: "Visitation Port",
    },
    {
      field: "visitation_country_name",
      header: "Visitation Country",
    },
    {
      field: "actions",
      header: "Actions",
    },
  ];

  const startChildEditing = (child) => {
    editingChildCode.value = child.section_code;
    editableChildDetails.value = child.details || "";
  };

  const cancelChildEditing = () => {
    editingChildCode.value = null;
    editableChildDetails.value = "";
  };

  const updateChildDescription = async (parentSection, child) => {
    const payload = {
      sections: [
        {
          section_code: child.section_code,
          details: editableChildDetails.value,
        },
      ],
    };

    await shipReportStore.updateSection(reportId, payload);
    cancelChildEditing();
  };

  const deleteSection = async (id) => {
    await shipReportStore.deleteCustomSection(reportId, id);
  };

  const startEditing = (section) => {
    editingSectionCode.value = section.section_code;
    editableDetails.value = section.details || "";
  };

  const cancelEditing = () => {
    editingSectionCode.value = null;
    editableDetails.value = "";
  };

  const updateDescription = async (section) => {
    const payload = {
      sections: [
        {
          section_code: section.section_code,
          details: editableDetails.value,
        },
      ],
    };

    await shipReportStore.updateSection(reportId, payload);
    editingSectionCode.value = null;
  };

  const openAddSectionModal = (section) => {
    selectedSection.value = section;
    visible.value = true;
    actionType.value = "add";
    newSection.value = { title: "", details: "" };
  };

  const AddCustomSectionModal = (section) => {
    selectedSection.value = section;
    visible.value = true;
    actionType.value = "addCustomSection";
    newCustomSection.value = { title: "", details: "" };
  };

  const openUpdateSectionModal = (section) => {
    selectedSection.value = section;
    visible.value = true;
    actionType.value = "update";

    editChildren.value = [
      {
        title: section.title,
        details: section.details,
      },
    ];
  };

  const getHeaderModal = (actionType) => {
    switch (actionType) {
      case "add":
        return "Add Details";

      case "update":
        return "Edit Section Details";

      case "addCustomSection":
        return "Add New Custom Section";

      default:
        return "";
    }
  };

  const getButtonName = (actionType) => {
    switch (actionType) {
      case "add":
        return "Add Section";

      case "addCustomSection":
        return "Add New Section";

      default:
        return "";
    }
  };

  const submitSection = async () => {
    const mode = actionType.value;

    switch (mode) {
      case "add":
        const addPayload = {
          title: newSection.value.title,
          details: newSection.value.details,
          parent_section_id: selectedSection.value.id,
        };

        await shipReportStore.addNewSection(reportId, addPayload);

        visible.value = false;
        break;

      case "addCustomSection":
        const addCustomPayload = {
          custom_sections: [
            {
              title: newCustomSection.value.title,
            },
          ],
        };

        await shipReportStore.addNewCustomSection(reportId, addCustomPayload);

        visible.value = false;
        break;

      case "update":
        const updatePayload = {
          sections: [
            {
              section_code: selectedSection.value.section_code,
              title: editChildren.value[0].title,
              details: editChildren.value[0].details,
            },
          ],
        };

        await shipReportStore.updateSection(reportId, updatePayload);
        visible.value = false;
        break;

      case "delete":
        const deletePayload = {
          sections: editChildren.value.map((child) => ({
            section_code: child.section_code,
            details: child.details,
          })),
        };

        await shipReportStore.updateSection(reportId, deletePayload);

        visible.value = false;
        break;

      default:
        visible.value = false;
        break;
    }
  };

  const handleDelete = (row) => {
    rowToDelete.value = row;
    showDeleteDialog.value = true;
  };

  const confirmDelete = async () => {
    if (rowToDelete.value?.id) {
      await shipReportStore.deleteReport(rowToDelete.value.id);
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
              label: "View",
              icon: "pi pi-eye",
              command: () =>
                router.push({
                  name: "ShipReportView",
                  params: { id: row.id },
                }),
            },
            {
              label: "View on New Tab",
              icon: "pi pi-external-link",
              command: () => {
                const url = router.resolve({
                  name: "ShipReportView",
                  params: { id: row.id },
                }).href;
                window.open(url, "_blank");
              },
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
    addNewSectionInputFields,
    updateSectionDetailsInputFields,
    addCustomSectionInputFields,
    shipReportCol,
    visible,
    selectedSection,
    actionType,
    newSection,
    newCustomSection,
    editChildren,
    editingChildCode,
    editableChildDetails,
    cancelChildEditing,
    startChildEditing,

    updateChildDescription,
    deleteSection,

    editingSectionCode,
    editableDetails,

    startEditing,
    cancelEditing,
    updateDescription,
    openAddSectionModal,
    AddCustomSectionModal,
    openUpdateSectionModal,
    getHeaderModal,
    getButtonName,
    submitSection,

    viewReportLoading,
    updateSectionDescLoading,
    isLoadingType,

    colActionHandlers,
    handleDelete,
    confirmDelete,

    rowToDelete,
    showDeleteDialog,
  };
}
