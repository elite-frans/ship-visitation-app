<script setup>
import ShipReportVisitor from "@/components/shipReport/ShipReportVisitor.vue";
import { useEditShipReport } from "@/composables/shipReport/useEditShipReport";
import { useShipParticipants } from "@/composables/shipReport/useShipParticipants";
import { useShipReport } from "@/composables/shipReport/useShipReport";
import { useShipReportStore } from "@/stores/shipReportStore";
import { dateFormatter } from "@/utils/dateFormatter";
import { dateFormatterYmd } from "@/utils/dateFormatterYmd";
import { Dialog } from "primevue";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const shipReportStore = useShipReportStore();
const router = useRouter();
const route = useRoute();
const routeId = route.params.id;

const {
  report,
  formData,
  orderedFields,
  handleUpdateReport,
  vesselInfoFields,
  isLoadingType,
  loadingState,
} = useEditShipReport();

const {
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
} = useShipReport(routeId, shipReportStore);

const {
  formData: formParticipantData,
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
} = useShipParticipants(routeId);

const visitDate = ref(null);

watch(visitDate, (newVal) => {
  console.log("Visit Date:", dateFormatterYmd(newVal));
  if (newVal) {
    const [start, end] = newVal;
    console.log("Start:", dateFormatterYmd(start));
    console.log("End:", dateFormatterYmd(end));
  }
});

onMounted(async () => {
  await shipReportStore.fetchOpenApiKeys();
});

const companiesLoaded = ref(false);

onMounted(async () => {
  if (!companiesLoaded.value) {
    await shipReportStore.fetchCompanies();
    companiesLoaded.value = true;
  }
});

const goBack = () => {
  router.push({ name: "ShipReport" });
};
</script>

<template>
  <div class="card">
    <div class="w-full h-full">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-bold uppercase">
            Edit Visitation Information:
          </h1>
          <Button
            label="Back"
            size="small"
            severity="secondary"
            variant="text"
            icon="pi pi-arrow-left"
            @click="goBack"
          />
        </div>
      </div>

      <div v-if="loadingState" class="flex flex-col w-full space-y-6">
        <!-- Vessel info skeletons -->
        <div
          v-for="n in 3"
          :key="'vessel-skeleton-' + n"
          class="grid grid-cols-1 mb-2 space-y-1 md:grid-cols-2 md:items-center"
        >
          <div class="font-medium text-neutral-300">
            <Skeleton width="40%" height="1rem" />
          </div>
          <Skeleton height="2.5rem" borderRadius="8px" />
        </div>

        <!-- Group section skeletons -->
        <div v-for="n in 6" :key="'section-skeleton-' + n">
          <div
            class="grid grid-cols-1 mb-2 space-y-1 md:grid-cols-2 md:items-center"
          >
            <div class="font-medium text-neutral-300">
              <Skeleton width="40%" height="1rem" />
            </div>
            <Skeleton height="2.5rem" borderRadius="8px" />
          </div>
        </div>

        <!-- Save button skeleton -->
        <div class="flex justify-end pt-4">
          <Skeleton width="8rem" height="2.2rem" borderRadius="8px" />
        </div>
      </div>

      <!-- Input field Forms -->
      <form v-else class="w-full">
        <Tabs class="pt-6" value="0">
          <TabList>
            <Tab value="0">Visitation Details</Tab>
            <Tab value="1">Participants</Tab>
            <Tab value="2">Sections</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <div class="flex flex-col w-full space-y-6">
                <div
                  class="grid grid-cols-1 space-y-1 mb-2 md:grid-cols-2 md:items-center"
                  v-for="(item, index) in vesselInfoFields"
                >
                  <label class="font-medium text-neutral-500"
                    >{{ item.label }}:
                  </label>
                  <DatePicker
                    v-if="item.type === 'datePicker'"
                    v-model="formData[item.model]"
                    class="w-full"
                    iconDisplay="input"
                    :manualInput="false"
                    :placeholder="item.placeholder"
                    :required="item.required ?? false"
                    fluid
                    showIcon
                  />
                  <DatePicker
                    v-if="item.type === 'datePickerRange'"
                    v-model="formData[item.model]"
                    selectionMode="range"
                    :manualInput="false"
                    showIcon
                    iconDisplay="input"
                    :placeholder="item.placeholder"
                    :required="item.required ?? false"
                    fluid
                  />
                  <Select
                    v-if="item.type === 'select'"
                    v-model="formData[item.model]"
                    :options="item?.options || []"
                    :optionLabel="item?.option_label || 'label'"
                    :optionValue="item?.option_value || 'value'"
                    :placeholder="item.placeholder"
                    class="w-full"
                    :loading="isLoadingType('fetch-api-keys')"
                    :required="item.required ?? false"
                    checkmark
                    filter
                  />
                  <InputText
                    v-if="item.type === 'text'"
                    type="text"
                    v-model="formData[item.model]"
                    :placeholder="item.placeholder"
                  />
                </div>
                <div
                  v-for="(item, index) in orderedFields"
                  :key="item.key ?? `group-${index}`"
                >
                  <!-- Group Header -->
                  <template v-if="item.isGroupHeader">
                    <h1 class="text-md font-bold mb-3 border-b pb-1 uppercase">
                      {{ item.name }}
                    </h1>
                  </template>

                  <!-- Field Input -->
                  <template v-else>
                    <div
                      class="grid grid-cols-1 space-y-1 mb-2 md:grid-cols-2 md:items-center md:mb-0"
                    >
                      <label class="font-medium text-neutral-500"
                        >{{ item.label }}:
                      </label>

                      <!-- Text / Number -->
                      <InputText
                        v-if="['text', 'number'].includes(item.type)"
                        v-model="formData[item.model]"
                        :type="item.type"
                        class="w-full"
                        :required="item.required ?? false"
                      />

                      <!-- Date Range -->
                      <DatePicker
                        v-else-if="item.type === 'datePickerRange'"
                        fluid
                        v-model="formData[item.model]"
                        selectionMode="range"
                        class="w-full"
                        :manualInput="false"
                        showIcon
                        iconDisplay="input"
                        :required="item.required ?? false"
                      />

                      <!-- Date -->
                      <DatePicker
                        v-else-if="item.type === 'datePicker'"
                        fluid
                        v-model="formData[item.model]"
                        class="w-full"
                        :manualInput="false"
                        showIcon
                        iconDisplay="input"
                        :required="item.required ?? false"
                      />

                      <!-- Select -->
                      <Select
                        v-if="item.type === 'select'"
                        v-model="formData[item.model]"
                        :options="item?.options || []"
                        :optionLabel="item?.option_label || 'label'"
                        :optionValue="item?.option_value || 'value'"
                        :placeholder="item.placeholder"
                        class="w-full"
                        :required="item.required ?? false"
                        filter
                      />

                      <!-- Select -->
                      <MultiSelect
                        v-if="item.type === 'multiselect'"
                        v-model="formData[item.model]"
                        :options="item?.options || []"
                        :optionLabel="item?.option_label || 'label'"
                        :optionValue="item?.option_value || 'raw'"
                        :placeholder="item.placeholder"
                        class="w-full"
                        :loading="isLoadingType('fetch-onboard-crew')"
                        :required="item.required ?? false"
                        filter
                        multiple
                      />
                    </div>

                    <!-- Divider for ungrouped fields -->
                    <div class="pt-4">
                      <Divider v-if="!item.group_input" />
                    </div>
                  </template>
                </div>
                <div class="flex justify-end pt-4">
                  <Button
                    :loading="isLoadingType('update-report')"
                    label="Save All Changes"
                    size="small"
                    @click="handleUpdateReport(routeId)"
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel value="1">
              <div class="space-y-4">
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
                  </TabList>
                  <TabPanels>
                    <TabPanel value="0">
                      <ShipReportVisitor
                        :reportId="routeId"
                        :report="report"
                        type="Visitor"
                      />
                    </TabPanel>
                    <TabPanel value="1">
                      <ShipReportVisitor
                        :reportId="routeId"
                        :report="report"
                        type="Interviewee"
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </div>
            </TabPanel>
            <TabPanel value="2">
              <!-- //* SECTIONS FIELDS -->
              <div class="pt-10">
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
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </form>
    </div>
  </div>

  <!-- //* SECTIONS DIALOG -->
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

  <!-- //* PARTICIPANT DIALOG -->
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
          v-model="formParticipantData.company"
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
          v-model="formParticipantData.participant"
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
            v-model="formParticipantData.last_name"
            placeholder="Enter last name"
            class="w-full"
          />
        </div>
        <div>
          <label class="font-semibold">First Name</label>
          <InputText
            v-model="formParticipantData.first_name"
            placeholder="Enter first name"
            class="w-full"
          />
        </div>
        <div>
          <label class="font-semibold">Rank</label>
          <InputText
            v-model="formParticipantData.rank"
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
              !formParticipantData.first_name.trim() ||
              !formParticipantData.last_name.trim()
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
