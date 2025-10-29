<script setup>
import { onMounted, ref } from "vue";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Dialog from "primevue/dialog";
import { useRoute, useRouter } from "vue-router";
import { useShipReportStore } from "@/stores/shipReportStore";
import { storeToRefs } from "pinia";
import { dateFormatter } from "@/utils/dateFormatter";
import { useShipReport } from "@/composables/shipReport/useShipReport";
import ShipReportVisitor from "@/components/shipReport/ShipReportVisitor.vue";
import { useShipParticipants } from "@/composables/shipReport/useShipParticipants";

const route = useRoute();
const router = useRouter();
const shipReportStore = useShipReportStore();
const visible = ref(false);
const selectedSection = ref(null);
const actionType = ref("add");
const reportId = route.params.id;
const visibleParticipant = ref(false);

const { formData, getOptions, inputFields, handleSubmit } =
  useShipParticipants(reportId);

const { report } = storeToRefs(shipReportStore);
const {
  addNewSectionInputFields,
  updateSectionDetailsInputFields,
  addCustomSectionInputFields,
} = useShipReport();

const goBack = () => {
  router.push({ name: "ShipReport" });
};

const newSection = ref({ title: "", details: "" });
const newCustomSection = ref({ title: "" });
const editChildren = ref([]);
const editingChildCode = ref(null);
const editableChildDetails = ref("");

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

const loading =
  shipReportStore.operation.loading &&
  shipReportStore.operation.type === "view";

const editingSectionCode = ref(null);
const editableDetails = ref("");

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

onMounted(() => {
  const id = route.params.id;
  shipReportStore.viewReport(id);
});
</script>
<template>
  <div v-if="loading" class="space-y-9 animate-pulse">
    <div class="card w-full h-full space-y-10">
      <!-- Visitation Details Skeleton -->
      <div class="space-y-4">
        <Skeleton width="10rem" height="1rem" class="mb-3" />
        <div v-for="n in 4" :key="n" class="grid grid-cols-2 gap-3 text-sm">
          <Skeleton width="6rem" height="0.8rem" />
          <Skeleton width="10rem" height="0.8rem" />
        </div>
      </div>
      <div class="space-y-4">
        <Skeleton width="10rem" height="1rem" class="mb-3" />
        <div v-for="n in 7" :key="n" class="grid grid-cols-2 gap-3 text-sm">
          <Skeleton width="6rem" height="0.8rem" />
          <Skeleton width="10rem" height="0.8rem" />
        </div>
      </div>
    </div>
    <div class="card w-full h-full">
      <!-- Tabs Skeleton -->
      <div class="space-y-3">
        <Skeleton width="60%" height="2rem" />
        <div v-for="n in 4" :key="n" class="space-y-2">
          <Skeleton width="70%" height="1rem" />
          <Skeleton width="50%" height="0.8rem" />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="card w-full h-full">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold">Ship Report Details</h1>
        <Button
          label="Back"
          size="small"
          severity="secondary"
          variant="text"
          icon="pi pi-arrow-left"
          @click="goBack"
        />
      </div>
      <divider />
      <div class="space-y-9">
        <div class="space-y-7">
          <h1 class="text-md font-bold">Visitation Details:</h1>
          <div class="space-y-3">
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Start Date Visit:</h1>
              <p>{{ dateFormatter(report?.visitation_start_date) }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">End Date Visit:</h1>
              <p>{{ dateFormatter(report?.visitation_end_date) }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Port:</h1>
              <p>{{ report?.visitation_port_name }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Country:</h1>
              <p>{{ report?.visitation_country_name }}</p>
            </div>
          </div>
        </div>
        <div class="space-y-7">
          <h1 class="text-md font-bold">Vessel Details:</h1>
          <div class="space-y-3">
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Vessel:</h1>
              <p>{{ report?.vessel_name }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Vessel Type:</h1>
              <p>{{ report?.vessel_type }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Vessel IMO No:</h1>
              <p>{{ report?.vessel_imo }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Flag:</h1>
              <p>{{ report?.vessel_flag }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">ISM Company:</h1>
              <p>{{ report?.vessel_ism_company }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Management:</h1>
              <p>{{ report?.vessel_management_office }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Fleet:</h1>
              <p>{{ report?.vessel_fleet }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card w-full h-full">
      <div class="flex justify-end">
        <Button
          label="Add Participant"
          size="small"
          icon="pi pi-user"
          @click="visibleParticipant = true"
        />
      </div>
      <Tabs value="0">
        <TabList>
          <Tab value="0">Visitor</Tab> <Tab value="1">Interviewer</Tab>
          <Tab value="2">Interviewee</Tab> <Tab value="3">Sections</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <ShipReportVisitor
              :reportId="reportId"
              :report="report"
              type="Visitor"
            />
          </TabPanel>
          <TabPanel value="1">
            <ShipReportVisitor
              :reportId="reportId"
              :report="report"
              type="Interviewer"
            />
          </TabPanel>
          <TabPanel value="2">
            <ShipReportVisitor
              :reportId="reportId"
              :report="report"
              type="Interviewee"
            />
          </TabPanel>
          <TabPanel value="3">
            <div
              class="w-full space-y-8 text-sm"
              v-if="report?.sections?.length"
            >
              <div
                v-for="(section, sIndex) in report.sections"
                :key="sIndex"
                class="w-full border-b pb-4"
              >
                <!-- Parent Section -->
                <div class="w-full mb-4">
                  <div class="flex items-center justify-between">
                    <h2 class="text-lg font-bold text-neutral-800">
                      {{ section.section_code }}. {{ section.title }}
                    </h2>
                    <div
                      v-if="section.category_key === 'custom'"
                      class="space-x-3"
                    >
                      <Button
                        :disabled="shipReportStore.operation.loading"
                        icon="pi pi-pencil"
                        variant="outlined"
                        severity="secondary"
                        aria-label="Edit Details"
                        size="small"
                        @click="openUpdateSectionModal(section)"
                      />
                      <Button
                        :disabled="shipReportStore.operation.loading"
                        icon="pi pi-trash"
                        variant="outlined"
                        severity="danger"
                        aria-label="Delete Details"
                        size="small"
                        @click="deleteSection(section.id)"
                      />
                    </div>
                  </div>
                  <div class="gap-y-2 mt-1">
                    <!-- When editing -->
                    <div
                      v-if="editingSectionCode === section.section_code"
                      class="space-y-2"
                    >
                      <Textarea
                        v-model="editableDetails"
                        rows="4"
                        class="w-full text-sm"
                        autoResize
                      />
                      <div class="flex gap-2">
                        <Button
                          label="Cancel"
                          size="small"
                          severity="secondary"
                          @click="cancelEditing"
                        />
                        <Button
                          label="Update"
                          size="small"
                          severity="primary"
                          :loading="shipReportStore.operation.loading"
                          :disabled="shipReportStore.operation.loading"
                          @click="updateDescription(section)"
                        />
                      </div>
                    </div>

                    <!-- When not editing -->
                    <div v-else class="flex items-center gap-x-3">
                      <p class="text-neutral-600">
                        {{ section.details || "No details yet." }}
                      </p>
                      <Button
                        v-if="section.category_key !== 'custom'"
                        icon="pi pi-pen-to-square"
                        size="small"
                        severity="secondary"
                        aria-label="Edit"
                        @click="startEditing(section)"
                      />
                    </div>
                  </div>
                </div>
                <!-- Child Sections -->
                <div
                  v-if="section.children && section.children.length"
                  class="w-full pl-6 space-y-3"
                >
                  <div
                    v-for="(child, cIndex) in section.children"
                    :key="cIndex"
                    class="w-full border-l-2 border-neutral-300 pl-3"
                  >
                    <div>
                      <h3 class="font-semibold text-neutral-700">
                        {{ child.section_code }}. {{ child.title }}
                      </h3>

                      <!-- When editing -->
                      <div
                        v-if="editingChildCode === child.section_code"
                        class="w-full mt-2 space-y-2"
                      >
                        <div class="flex flex-col w-full">
                          <Textarea
                            v-model="editableChildDetails"
                            rows="3"
                            class="flex-1 w-full text-sm"
                            autoResize
                          />
                        </div>
                        <div class="flex gap-2">
                          <Button
                            label="Cancel"
                            size="small"
                            severity="secondary"
                            @click="cancelChildEditing"
                          />
                          <Button
                            label="Update"
                            size="small"
                            severity="primary"
                            :loading="shipReportStore.operation.loading"
                            :disabled="shipReportStore.operation.loading"
                            @click="updateChildDescription(section, child)"
                          />
                        </div>
                      </div>

                      <!-- When not editing -->
                      <p v-else class="text-neutral-500 mt-1">
                        {{ child.details || "No details yet." }}
                      </p>
                    </div>

                    <!-- Action Buttons -->
                    <div
                      v-if="editingChildCode !== child.section_code"
                      class="space-x-1 mt-1"
                    >
                      <Button
                        style="color: #0ea5e9"
                        :disabled="shipReportStore.operation.loading"
                        variant="link"
                        label="Edit Details"
                        size="small"
                        @click="startChildEditing(child)"
                      />
                      <Button
                        v-if="section.category_key === 'custom'"
                        :disabled="shipReportStore.operation.loading"
                        variant="link"
                        severity="danger"
                        label="Delete"
                        size="small"
                        @click="deleteSection(child.id)"
                      />
                    </div>
                  </div>
                </div>

                <!-- Fallback if no children -->
                <div v-else class="pl-6 text-neutral-400 italic">
                  No sub-sections.
                </div>
                <div class="mt-3">
                  <Button
                    :disabled="shipReportStore.operation.loading"
                    size="small"
                    label="Add Details"
                    variant="outlined"
                    @click="openAddSectionModal(section)"
                  />
                </div>
              </div>
            </div>
            <p v-else>No section found.</p>
            <div class="w-full flex justify-center m-0 pt-6">
              <Button
                label="Add New Section"
                size="small"
                :loading="shipReportStore.operation.loading"
                :disabled="shipReportStore.operation.loading"
                @click="AddCustomSectionModal(section)"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>

  <!-- SECTIONS DIALOG -->
  <Dialog
    v-model:visible="visible"
    modal
    :header="getHeaderModal(actionType)"
    :style="{ width: '32rem' }"
  >
    <div class="space-y-4">
      <!-- If adding -->
      <template v-if="actionType === 'add'">
        <h1 class="text-lg text-neutral-500">{{ selectedSection?.title }}</h1>
        <div
          class="space-y-1"
          v-for="field in addNewSectionInputFields"
          :key="field.key"
        >
          <label :for="field.key" class="font-semibold">{{
            field.label
          }}</label>
          <InputText
            v-if="field.type === 'text' || field.type === 'number'"
            v-model="newSection[field.model]"
            :placeholder="field.placeholder"
            class="w-full"
          />
          <Textarea
            v-else-if="field.type === 'textarea'"
            v-model="newSection[field.model]"
            rows="4"
            class="w-full"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="visible = false"
          />
          <Button
            type="button"
            :label="getButtonName(actionType)"
            severity="primary"
            @click="submitSection"
            :loading="shipReportStore.operation.loading"
            :disabled="
              (actionType === 'add' && !newSection.title.trim()) ||
              shipReportStore.operation.loading
            "
          />
        </div>
      </template>

      <!-- If add new section -->
      <template v-if="actionType === 'addCustomSection'">
        <h1 class="text-lg text-neutral-500">{{ selectedSection?.title }}</h1>
        <div
          class="space-y-1"
          v-for="field in addCustomSectionInputFields"
          :key="field.key"
        >
          <label :for="field.key" class="font-semibold">{{
            field.label
          }}</label>
          <InputText
            v-if="field.type === 'text' || field.type === 'number'"
            v-model="newCustomSection[field.model]"
            :placeholder="field.placeholder"
            class="w-full"
          />
          <Textarea
            v-else-if="field.type === 'textarea'"
            v-model="newCustomSection[field.model]"
            rows="4"
            class="w-full"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            label="Cancel"
            severity="secondary"
            @click="visible = false"
          />
          <Button
            type="button"
            :label="getButtonName(actionType)"
            severity="primary"
            :loading="shipReportStore.operation.loading"
            @click="submitSection"
            :disabled="
              (actionType === 'addCustomSection' &&
                !newCustomSection.title.trim()) ||
              shipReportStore.operation.loading
            "
          />
        </div>
      </template>

      <!-- If editing -->
      <template v-if="actionType === 'update'">
        <div
          v-for="(child, index) in editChildren"
          :key="child.id"
          class="space-y-1 border-b pb-4"
        >
          <div
            v-for="field in updateSectionDetailsInputFields"
            :key="field.key + '-' + index"
            class="space-y-1"
          >
            <label :for="field.key" class="font-semibold">{{
              field.label
            }}</label>
            <InputText
              v-if="field.type === 'text' || field.type === 'number'"
              v-model="editChildren[index][field.model]"
              :placeholder="field.placeholder"
              :readonly="field.readonly ?? false"
              class="w-full"
            />
            <Textarea
              v-else-if="field.type === 'textarea'"
              v-model="editChildren[index][field.model]"
              rows="4"
              class="w-full"
            />
          </div>
          <div class="flex justify-end gap-2">
            <Button
              type="button"
              label="Cancel"
              severity="secondary"
              @click="visible = false"
            />
            <Button
              type="button"
              label="Update"
              :disabled="shipReportStore.operation.loading"
              :loading="shipReportStore.operation.loading"
              severity="success"
              @click="submitSection"
            />
          </div>
        </div>
      </template>
    </div>
  </Dialog>

  <!-- PARTICIPANT DIALOG -->
  <Dialog
    v-model:visible="visibleParticipant"
    modal
    header="Add New Participant"
    :style="{ width: '30rem' }"
  >
    <div class="space-y-4">
      <div class="space-y-1" v-for="field in inputFields" :key="field.key">
        <label :for="field.key" class="font-semibold">
          {{ field.label }}
        </label>

        <!-- Text / Number -->
        <InputText
          v-if="field.type === 'text' || field.type === 'number'"
          v-model="formData[field.model]"
          :placeholder="field.placeholder"
          class="w-full"
        />

        <!-- Textarea -->
        <Textarea
          v-else-if="field.type === 'textarea'"
          v-model="formData[field.model]"
          rows="4"
          class="w-full"
        />

        <!-- ✅ Dynamic Select -->
        <Select
          v-else-if="field.type === 'selection'"
          v-model="formData[field.model]"
          :options="getOptions(field)"
          optionLabel="name"
          optionValue="value"
          :placeholder="field.placeholder"
          class="w-full"
        />

        <MultiSelect
          v-else-if="field.type === 'multiselect'"
          v-model="formData[field.model]"
          display="chip"
          :options="getOptions(field)"
          optionLabel="name"
          :placeholder="field.placeholder"
          class="w-full"
        />
      </div>
    </div>

    <div class="flex justify-end gap-2 pt-6">
      <Button label="Cancel" severity="secondary" @click="visibleParticipant = false" />
      <Button
        label="Save"
        @click="handleSubmit"
        :loading="shipReportStore.operation.loading"
        :disabled="shipReportStore.operation.loading"
      />
    </div>
  </Dialog>
</template>
