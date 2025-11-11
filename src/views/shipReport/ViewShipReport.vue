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
const reportId = route.params.id;
const shipReportStore = useShipReportStore();
const { report } = storeToRefs(shipReportStore);

const companiesLoaded = ref(false);

onMounted(async () => {
  if (!companiesLoaded.value) {
    await shipReportStore.fetchCompanies();
    companiesLoaded.value = true;
  }
});

const {
  formData,
  getOptions,
  handleSubmit,
  openAddDialog,
  showPersonSelect,
  showManualAdd,
  visibleParticipant,
  canSubmit,
  addManualToList,
  removeManualFromList,
  addVisitorLoading,
} = useShipParticipants(reportId);

const {
  viewReportLoading,
  addNewSectionInputFields,
  updateSectionDetailsInputFields,
  addCustomSectionInputFields,
  visible,
  selectedSection,
  actionType,
  newSection,
  newCustomSection,
  editChildren,
  editingChildCode,
  cancelChildEditing,
  editableChildDetails,
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
  updateSectionDescLoading,
  isLoadingType,
} = useShipReport(reportId, shipReportStore);

const goBack = () => {
  router.push({ name: "ShipReport" });
};

const loading =
  shipReportStore.operation.loading &&
  shipReportStore.operation.type === "view";

onMounted(() => {
  const id = route.params.id;
  shipReportStore.viewReport(id);
});
</script>
<template>
  <div v-if="viewReportLoading" class="space-y-9 animate-pulse">
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
        <!-- //* VESSEL DETAILS -->
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
        <divider />
        <!-- //* VISITATION DETAILS -->
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

        <divider />
        <!-- //* VISITATION DETAILS -->
        <div class="space-y-7">
          <h1 class="text-md font-bold">Last ICBT Result Details:</h1>
          <div class="space-y-3">
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Date:</h1>
              <p>{{ dateFormatter(report?.last_icbt_date) }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Port Name:</h1>
              <p>{{ dateFormatter(report?.last_icbt_port_name) }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Port:</h1>
              <p>{{ report?.visitation_port_name }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Result:</h1>
              <p>{{ report?.last_icbt_result }}</p>
            </div>
          </div>
        </div>

        <divider />
        <!-- //* PSC DETAILS -->
        <div class="space-y-7">
          <h1 class="text-md font-bold">Last PSC Result Details:</h1>
          <div class="space-y-3">
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Date:</h1>
              <p>{{ dateFormatter(report?.last_psc_date) }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Port Name:</h1>
              <p>{{ dateFormatter(report?.last_psc_port_name) }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Port:</h1>
              <p>{{ report?.visitation_port_name }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Result:</h1>
              <p>{{ report?.last_psc_result }}</p>
            </div>
          </div>
        </div>

        <divider />
        <!-- //* DOCKING DETAILS -->
        <div class="space-y-7">
          <h1 class="text-md font-bold">Last Docking Details:</h1>
          <div class="space-y-3">
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Date:</h1>
              <p>{{ dateFormatter(report?.last_docking_date) }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Last Place:</h1>
              <p>{{ dateFormatter(report?.last_docking_place) }}</p>
            </div>
            <div class="grid grid-cols-2 text-sm">
              <h1 class="text-neutral-500">Next Place:</h1>
              <p>{{ report?.next_docking_place }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card w-full h-full">
      <div class="flex justify-end">
        <Button
          label="Add Visitor"
          size="small"
          icon="pi pi-user"
          @click="visibleParticipant = true"
        />
      </div>
      <Tabs value="0">
        <TabList>
          <Tab value="0">Visitors</Tab>
          <Tab value="1">Interviewee</Tab>
          <Tab value="2">Sections</Tab>
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
              type="Interviewee"
            />
          </TabPanel>
          <TabPanel value="2">
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
                          :loading="updateSectionDescLoading"
                          :disabled="updateSectionDescLoading"
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
                            :loading="updateSectionDescLoading"
                            :disabled="updateSectionDescLoading"
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
                :loading="isLoadingType('add-custom-section')"
                :disabled="isLoadingType('add-custom-section')"
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
            size="small"
            label="Cancel"
            severity="secondary"
            @click="visible = false"
          />
          <Button
            type="button"
            :label="getButtonName(actionType)"
            severity="primary"
            size="small"
            @click="submitSection"
            :loading="isLoadingType('add-section-detail')"
            :disabled="
              (actionType === 'add' && !newSection.title.trim()) ||
              isLoadingType('add-section-detail')
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
            size="small"
            severity="secondary"
            @click="visible = false"
          />
          <Button
            type="button"
            :label="getButtonName(actionType)"
            severity="primary"
            size="small"
            :loading="isLoadingType('add-custom-section')"
            @click="submitSection"
            :disabled="
              (actionType === 'addCustomSection' &&
                !newCustomSection.title.trim()) ||
              isLoadingType('add-custom-section')
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
              size="small"
              severity="secondary"
              @click="visible = false"
            />
            <Button
              type="button"
              label="Update"
              size="small"
              :disabled="isLoadingType('update-section')"
              :loading="isLoadingType('update-section')"
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
    header="Add New Visitor"
    :style="{ width: '30rem' }"
    @update:visible="
      (val) => {
        if (!val) resetForm();
      }
    "
  >
    <div class="space-y-4">
      <!-- Company -->
      <div>
        <label class="font-semibold">Company</label>
        <Select
          v-model="formData.company"
          :options="getOptions({ model: 'company' })"
          optionLabel="name"
          optionValue="value"
          placeholder="Select company"
          class="w-full"
        />
      </div>

      <!-- Participants -->
      <div v-if="showPersonSelect && !showManualAdd">
        <label class="font-semibold">Participants</label>

        <!-- Custom option template to show "New Added" -->
        <MultiSelect
          v-model="formData.participant"
          display="chip"
          :loading="isLoadingType('participant-selection')"
          :options="getOptions({ model: 'participant' })"
          optionLabel="name"
          optionValue="value"
          :placeholder="
            isLoadingType('participant-selection')
              ? 'Loading...'
              : 'Select participants'
          "
          class="w-full"
        >
          <template #option="slotProps">
            <div class="flex items-center justify-between w-full">
              <span>{{ slotProps.option.name }}</span>
              <div class="flex items-center">
                <Tag
                  v-if="slotProps.option.isNew"
                  severity="success"
                  value="New Added"
                />
                <!-- <Button
                  v-if="slotProps.option.isNew"
                  icon="pi pi-trash"
                  text
                  rounded
                  class="ml-2"
                  @click.stop="removeManualFromList(slotProps.option)"
                /> -->
              </div>
            </div>
          </template>
        </MultiSelect>
      </div>

      <!-- Manual Add Button -->
      <div class="text-right" v-if="showPersonSelect && !showManualAdd">
        <Button
          size="small"
          label="Add Visitor"
          icon="pi pi-user-plus"
          text
          @click="showManualAdd = true"
        />
      </div>

      <!-- Manual Add Fields -->
      <div v-if="showManualAdd" class="space-y-2">
        <div>
          <label class="font-semibold">Last Name</label>
          <InputText
            v-model="formData.last_name"
            placeholder="Enter last name"
            class="w-full"
          />
        </div>
        <div>
          <label class="font-semibold">First Name</label>
          <InputText
            v-model="formData.first_name"
            placeholder="Enter first name"
            class="w-full"
          />
        </div>
        <div>
          <label class="font-semibold">Rank</label>
          <InputText
            v-model="formData.rank"
            placeholder="Enter rank"
            class="w-full"
          />
        </div>

        <div class="flex justify-between pt-6">
          <Button
            size="small"
            label="Back to Select List"
            icon="pi pi-arrow-left"
            text
            @click="showManualAdd = false"
          />
          <Button
            size="small"
            label="Add Participant"
            icon="pi pi-plus"
            severity="success"
            @click="addManualToList"
            :disabled="
              !formData.first_name.trim() || !formData.last_name.trim()
            "
          />
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div v-if="!showManualAdd" class="flex justify-end gap-2 pt-6">
      <Button
        label="Cancel"
        size="small"
        severity="secondary"
        @click="visibleParticipant = false"
      />
      <Button
        label="Save"
        size="small"
        @click="handleSubmit"
        :disabled="!canSubmit || addVisitorLoading"
        :loading="addVisitorLoading"
      />
    </div>
  </Dialog>
</template>
