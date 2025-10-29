import { reactive } from "vue";

export function useShipReport() {
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

  return {
    addNewSectionInputFields,
    updateSectionDetailsInputFields,
    addCustomSectionInputFields,
    shipReportCol,
  };
}
