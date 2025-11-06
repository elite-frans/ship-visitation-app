import { useShipReportStore } from "@/stores/shipReportStore";
import { computed, onMounted, reactive, ref } from "vue";

export function useCreateShipReport() {
  const formData = reactive({
    date_visit: null,
    user_reporter: null,
    external_vessel_id: null,
    visitation_port_id: null,
    visitation_country_id: null,
    last_visitation_port_id: null,
    last_psc_port_id: null,
    port_last_psc_inspection: null,
    last_icbt_port_id: null,
  });

  const shipReportStore = useShipReportStore();

  //* States for Section inputfields:
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

  const vesselInfoFields = reactive([
    {
      key: "date_visit",
      model: "date_visit",
      label: "Date",
      type: "datePickerRange",
      placeholder: "Select date",
      required: true,
    },
    {
      key: "user_reporter",
      model: "user_reporter",
      label: "User Reporter",
      type: "text",
      placeholder: "Enter user reporter",
      required: true,
    },
    {
      key: "external_vessel_id",
      apiKey: "vessels",
      model: "external_vessel_id",
      label: "Ship's Name",
      type: "select",
      placeholder: "Select Ship",
      required: true,
    },
  ]);

  const inputFields = reactive([
    // {
    //   key: "ship_name",
    //   model: "ship_name",
    //   label: "Ship's Name",
    //   type: "select",
    //   placeholder: "Select Ship",
    //   required: true,
    // },
    //* LAST VISITATION
    {
      group_input: "Date / Port Name of Visitation",
      key: "date_visitation",
      model: "date_visitation",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date visit",
      required: true,
    },
    {
      group_input: "Date / Port Name of Visitation",
      apiKey: "ports",
      key: "visitation_port_id",
      model: "visitation_port_id",
      label: "Port name",
      type: "select",
      placeholder: "Select port name",
      required: true,
    },
    {
      key: "visitor_name",
      model: "visitor_name",
      label: "Visitor",
      type: "text",
      placeholder: "Enter visitor name",
      required: true,
    },
    {
      key: "participants",
      model: "participants",
      label: "Interviewee (Rank and Name)",
      type: "select",
      placeholder: "Select visitor name",
      required: true,
    },

    //* LAST VISITATION
    {
      group_input: "Date / Port Name of Last Visitation",
      key: "last_visitation_date",
      model: "last_visitation_date",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Port Name of Last Visitation",
      apiKey: "ports",
      key: "last_visitation_port_id",
      model: "last_visitation_port_id",
      label: "Port Name",
      type: "select",
      placeholder: "Select port name",
      required: true,
    },

    //* LAST PSC INSPECTION
    {
      group_input: "Date / Port Name / Result of Last PSC Inspection",
      key: "last_psc_date",
      model: "last_psc_date",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of Last PSC Inspection",
      apiKey: "ports",
      key: "last_psc_port_id",
      model: "last_psc_port_id",
      label: "Port Name",
      type: "select",
      placeholder: "Select port name",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of Last PSC Inspection",
      key: "last_psc_result_deficiencies",
      model: "last_psc_result_deficiencies",
      label: "Result",
      type: "text",
      placeholder: "Enter result",
      required: true,
    },

    //* SMS INTERNAL AUDIT
    {
      group_input: "Date / Port Name / Result of SMS Internal Audit",
      key: "date_last_psc_inspection",
      model: "date_last_psc_inspection",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of SMS Internal Audit",
      key: "port_last_psc_inspection",
      model: "port_last_psc_inspection",
      label: "Port Name",
      type: "select",
      placeholder: "Enter port name",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of SMS Internal Audit",
      key: "result_last_psc_inspection",
      model: "result_last_psc_inspection",
      label: "Result",
      type: "text",
      placeholder: "Enter result",
      required: true,
    },

    //* ICBT INSPECTION
    {
      group_input: "Date / Port Name / Result of ICBT Inspection",
      key: "last_icbt_date",
      model: "last_icbt_date",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of ICBT Inspection",
      apiKey: "ports",
      key: "last_icbt_port_id",
      model: "last_icbt_port_id",
      label: "Port Name",
      type: "select",
      placeholder: "Enter port name",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of ICBT Inspection",
      key: "last_icbt_result",
      model: "last_icbt_result",
      label: "Result",
      type: "text",
      placeholder: "Enter result",
      required: true,
    },

    //* LAST DOCKING PLACE
    {
      group_input: "Date / Last Docking Place",
      key: "last_docking_date",
      model: "last_docking_date",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Last Docking Place",
      key: "last_docking_place",
      model: "last_docking_place",
      label: "Last Docking Place",
      type: "text",
      placeholder: "Enter docking place",
      required: true,
    },
    {
      key: "next_docking_place",
      model: "next_docking_place",
      label: "Next Docking Place",
      type: "text",
      placeholder: "Enter next docking place",
      required: true,
    },
  ]);

  onMounted(async () => {
    await shipReportStore.fetchOpenApiKeys();

    const optionsData = shipReportStore.apiKeys;

    inputFields.forEach((field) => {
      if (field.apiKey && optionsData[field.apiKey]) {
        field.options = optionsData[field.apiKey].map((item) => ({
          label: item.name,
          value: item.value,
        }));
      }
    });

    vesselInfoFields.forEach((field) => {
      if (field.apiKey && optionsData[field.apiKey]) {
        field.options = optionsData[field.apiKey].map((item) => ({
          label: item.name,
          value: item.value,
        }));
      }
    });
  });

  const preDefineSections = reactive([
    {
      category_key: "basic_details",
      details: "Vessel and visit basic information",
      section_code: "1",
      title: "Basic Details",
      children: [],
    },
    {
      category_key: "purpose",
      details: "Describe the purpose of the visit...",
      section_code: "2",
      title: "Purpose",
      children: [],
    },
    {
      category_key: "crew_management_and_atmosphere",
      details: "Describe crew management observations and atmosphere...",
      section_code: "3",
      title: "Crew management and Atmosphere",
      children: [],
    },
    {
      category_key: "navigation",
      details: null,
      section_code: "4",
      title: "Navigation & Navigation Equipment",
      children: [
        {
          category_key: "navigation_equipment",
          details: "Describe equipment condition and functionality...",
          section_code: "4.1",
          title: "Navigation Equipment",
          children: [],
        },
        {
          category_key: "navigation_ecdis",
          details: "Assess ECDIS proficiency and usage...",
          section_code: "4.2",
          title: "ECDIS Proficiency",
          children: [],
        },
      ],
    },
    {
      category_key: "legal",
      details: null,
      section_code: "5",
      title: "Legal",
      children: [
        {
          category_key: "legal_orb_grb",
          details: "Check Oil Record Book and Garbage Record Book...",
          section_code: "5.1",
          title: "ORB / GRB",
          children: [],
        },
        {
          category_key: "legal_lsa_ffa",
          details:
            "Check Life Saving Appliances and Fire Fighting Appliances...",
          section_code: "5.2",
          title:
            "LSA / FFA incl. Fire Line (Condition / Crew knowledge and Familiarization)",
          children: [],
        },
        {
          category_key: "legal_mlc",
          details: "Check Maritime Labour Convention compliance...",
          section_code: "5.3",
          title: "MLC-2006",
          children: [],
        },
        {
          category_key: "legal_filing",
          details: "Check company correspondence filing...",
          section_code: "5.4",
          title:
            "Filing of Company Letters (Official Letter, INF Letter, DPM, etc)",
          children: [],
        },
        {
          category_key: "legal_alcohol",
          details: "Check alcohol testing records and compliance...",
          section_code: "5.5",
          title:
            "Compliance with Company Alcohol Policy/Records(SMS-I-04-F2) and maintenance of testers",
          children: [],
        },
      ],
    },
    {
      category_key: "supplies",
      details: "Document supplies status and requirements...",
      section_code: "6",
      title: "Supplies (Qualities), Dead stocks and Store Arrangement:",
      children: [],
    },
    {
      category_key: "maintenance",
      details:
        "Maintenance situation of current ship (what kind of place you are focusing on) and future planned maintenance",
      section_code: "7",
      title: "Maintenance",
      children: [
        {
          category_key: "maintenance_deck",
          details: null,
          section_code: "7.1",
          title: "Deck",
          children: [
            {
              category_key: "maintenance_deck_hyd",
              details: "Check hydraulic lines and winches...",
              section_code: "7.1.1",
              title: "Hyd. Line & Winch / Elec. Winch: ",
              children: [],
            },
            {
              category_key: "maintenance_deck_grease",
              details: "Check lubrication supplies and condition...",
              section_code: "7.1.2",
              title: "Grease & Gear Compound:",
              children: [],
            },
          ],
        },
        {
          category_key: "maintenance_engine",
          details: null,
          section_code: "7.2",
          title: "Engine",
          children: [
            {
              category_key: "maintenance_engine_oil",
              details: "Check oil content meter and functionality...",
              section_code: "7.2.1",
              title: "Oil Content-mater etc.",
              children: [],
            },
          ],
        },
        {
          category_key: "maintenance_radio",
          details: "Check radio equipment condition and compliance...",
          section_code: "7.3",
          title: "Radio Communication Equipment",
          children: [],
        },
        {
          category_key: "maintenance_computer",
          details: "Check computer systems and BASS functionality...",
          section_code: "7.4",
          title: "Ship Computer and BASS",
          children: [],
        },
      ],
    },
    {
      category_key: "crew_evaluation",
      details: "Evaluate crew performance and competency...",
      section_code: "8",
      title: "Crew Evaluation",
      children: [],
    },
    {
      category_key: "others",
      details: "Impression at the time of visit (good place \u00b7 bad place)",
      section_code: "9",
      title: "Others",
      children: [],
    },
  ]);

  // Group by group_input
  const orderedFields = computed(() => {
    const seenGroups = new Set();
    const ordered = [];

    for (const field of inputFields) {
      const groupName = field.group_input;
      if (groupName && !seenGroups.has(groupName)) {
        // Insert a synthetic "group header" object
        ordered.push({
          isGroupHeader: true,
          name: groupName,
        });
        seenGroups.add(groupName);
      }
      ordered.push(field);
    }

    return ordered;
  });

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

  //* Section Actions:
  const startChildEditing = (child) => {
    editingChildCode.value = child.section_code;
    editableChildDetails.value = child.details || "";
  };

  const cancelChildEditing = () => {
    editingChildCode.value = null;
    editableChildDetails.value = "";
  };

  const updateChildDescription = async (parentSection, child) => {
    const target = parentSection.children.find(
      (c) => c.section_code === child.section_code
    );
    if (target) {
      target.details = editableChildDetails.value;
    }

    // const payload = {
    //   sections: [
    //     {
    //       section_code: child.section_code,
    //       details: editableChildDetails.value,
    //     },
    //   ],
    // };

    cancelChildEditing();
  };

  const deleteSection = (section) => {
    const index = preDefineSections.findIndex(
      (s) => s.section_code === section.section_code
    );
    if (index !== -1) preDefineSections.splice(index, 1);

    preDefineSections.forEach((parent, parentIndex) => {
      parent.section_code = `${parentIndex + 1}`;

      if (parent.children && parent.children.length) {
        parent.children.forEach((child, childIndex) => {
          child.section_code = `${parent.section_code}.${childIndex + 1}`;
        });
      }
    });
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

    // await shipReportStore.updateSection(reportId, payload);
    editingSectionCode.value = null;
  };

  const openAddSectionModal = (section) => {
    selectedSection.value = section;
    visible.value = true;
    actionType.value = "add";
    newSection.value = { title: "", details: "" };
  };

  const handleRemove = (parent, child) => {
    if (parent && parent.children) {
      parent.children = parent.children.filter(
        (c) => c.section_code !== child.section_code
      );

      parent.children.forEach((c, index) => {
        const baseCode = parent.section_code;
        c.section_code = `${baseCode}.${index + 1}`;
      });
    }
  };

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

  const AddCustomSectionModal = () => {
    actionType.value = "addCustomSection";
    visible.value = true;

    // reset modal inputs
    newCustomSection.value = {
      title: "",
      details: "",
    };
  };

  const openUpdateSectionModal = (section) => {
    actionType.value = "update";
    visible.value = true;
    selectedSection.value = section;

    editChildren.value = [
      {
        title: section.title,
        details: section.details,
      },
    ];
  };

  const submitSection = async () => {
    const mode = actionType.value;

    switch (mode) {
      case "add": {
        const parent = selectedSection.value;
        if (!parent) return;

        // Determine new section code dynamically:
        const nextIndex = (parent.children?.length || 0) + 1;
        const newCode = `${parent.section_code}.${nextIndex}`;

        const newChild = {
          category_key: "custom_child",
          title: newSection.value.title,
          details: newSection.value.details,
          section_code: newCode,
          children: [],
        };

        // Ensure children exists then push
        if (!parent.children) parent.children = [];
        parent.children.push(newChild);

        visible.value = false;
        break;
      }

      case "addCustomSection": {
        const nextCode = `${preDefineSections.length + 1}`;
        const newCustom = {
          category_key: "custom",
          title: newCustomSection.value.title,
          details: newCustomSection.value.details || "",
          section_code: nextCode,
          children: [],
        };

        preDefineSections.push(newCustom);
        visible.value = false;
        break;
      }

      case "update": {
        const section = selectedSection.value;
        if (!section) return;

        section.title = editChildren.value[0].title;
        section.details = editChildren.value[0].details;

        visible.value = false;
        break;
      }

      default:
        visible.value = false;
        break;
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

  const flattenSections = (sections) => {
    const result = [];
    sections.forEach((section) => {
      // push parent
      result.push({
        section_code: section.section_code,
        details: section.details || "",
        title: section.title || "",
      });

      // push children
      if (section.children?.length) {
        section.children.forEach((child) => {
          result.push({
            section_code: child.section_code,
            details: child.details || "",
            title: child.title || "",
          });
        });
      }
    });
    return result;
  };

  const handleSubmitReport = () => {
    const payload = {
      visitation_start_date: formData.date_visit.start,
      visitation_end_date: end,
      external_vessel_id: "617e4f68-ef37-4501-98a2-8fcbe0215875",
      sections: flattenSections(preDefineSections),
      ...formData,
    };

    console.log("Submit report: ", payload);
  };

  return {
    formData,
    visible,
    selectedSection,
    actionType,
    newSection,
    newCustomSection,
    editChildren,
    editingChildCode,
    editableChildDetails,
    editingSectionCode,
    editableDetails,
    inputFields,
    preDefineSections,
    orderedFields,
    getHeaderModal,
    addNewSectionInputFields,
    startChildEditing,
    cancelChildEditing,
    updateChildDescription,
    deleteSection,
    startEditing,
    cancelEditing,
    updateDescription,
    openAddSectionModal,
    AddCustomSectionModal,
    openUpdateSectionModal,
    submitSection,
    getButtonName,
    handleRemove,
    addCustomSectionInputFields,
    updateSectionDetailsInputFields,
    handleSubmitReport,
    vesselInfoFields,
  };
}
