import { computed, reactive } from "vue";

export function useCreateShipReport() {
  const formData = reactive({});

  // {
  //   group_input: "start",
  //   key: "date_start",
  //   model: "date_start",
  //   label: "Date",
  //   type: "datePickerRange",
  //   placeholder: "Select Date",
  //   required: true,
  // },
  // {
  //   group_input: "start",
  //   key: "reporter_start",
  //   model: "reporter_start",
  //   label: "Reporter",
  //   type: "text",
  //   placeholder: "Enter reporter",
  //   required: true,
  // },

  const inputFields = reactive([
    {
      key: "ship_name",
      model: "ship_name",
      label: "Ship's Name",
      type: "select",
      placeholder: "Select Ship",
      required: true,
    },
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
      key: "port_visitation",
      model: "port_visitation",
      label: "Name",
      type: "text",
      placeholder: "Enter port name",
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
      key: "interviewee",
      model: "interviewee",
      label: "Interviewee (Rank and Name)",
      type: "select",
      placeholder: "Enter visitor name",
      required: true,
    },

    //* LAST VISITATION
    {
      group_input: "Date / Port Name of Last Visitation",
      key: "date_last_visitation",
      model: "date_last_visitation",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Port Name of Last Visitation",
      key: "port_name_last_visitation",
      model: "port_name_last_visitation",
      label: "Port Name",
      type: "text",
      placeholder: "Enter port name",
      required: true,
    },

    //* LAST PSC INSPECTION
    {
      group_input: "Date / Port Name / Result of Last PSC Inspection",
      key: "date_last_psc_inspection",
      model: "date_last_psc_inspection",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of Last PSC Inspection",
      key: "port_last_psc_inspection",
      model: "port_last_psc_inspection",
      label: "Port Name",
      type: "text",
      placeholder: "Enter port name",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of Last PSC Inspection",
      key: "result_last_psc_inspection",
      model: "result_last_psc_inspection",
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
      type: "text",
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
      key: "date_icbt_inspection",
      model: "date_icbt_inspection",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of ICBT Inspection",
      key: "port_icbt_inspection",
      model: "port_icbt_inspection",
      label: "Port Name",
      type: "text",
      placeholder: "Enter port name",
      required: true,
    },
    {
      group_input: "Date / Port Name / Result of ICBT Inspection",
      key: "result_icbt_inspection",
      model: "result_icbt_inspection",
      label: "Result",
      type: "text",
      placeholder: "Enter result",
      required: true,
    },

    //* LAST DOCKING PLACE
    {
      group_input: "Date / Last Docking Place",
      key: "date_last_docking_place",
      model: "date_last_docking_place",
      label: "Date",
      type: "datePicker",
      placeholder: "Select date",
      required: true,
    },
    {
      group_input: "Date / Last Docking Place",
      key: "name_last_docking_place",
      model: "name_last_docking_place",
      label: "Last Docking Place",
      type: "text",
      placeholder: "Enter docking place",
      required: true,
    },
    {
      key: "name_next_docking_place",
      model: "name_next_docking_place",
      label: "Next Docking Place",
      type: "text",
      placeholder: "Enter next docking place",
      required: true,
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

  return { formData, inputFields, orderedFields };
}
