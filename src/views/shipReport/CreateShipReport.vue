<script setup>
import { useCreateShipReport } from "@/composables/shipReport/useCreateShipReport";
import { useShipReportStore } from "@/stores/shipReportStore";
import { dateFormatter } from "@/utils/dateFormatter";
import { dateFormatterYmd } from "@/utils/dateFormatterYmd";
import { Dialog } from "primevue";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

const shipReportStore = useShipReportStore();

const {
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
} = useCreateShipReport();

const router = useRouter();

const visitDate = ref(null);
const reporter = ref();
const shipsName = ref();

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
            Vessel Visitation Information:
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
        <Divider />
      </div>

      <!-- Input field Forms -->
      <form class="w-full pt-10">
        <div class="space-y-6">
          <div
            class="grid grid-cols-1 space-y-1 mb-2 md:grid-cols-2 md:items-center md:mb-0"
            v-for="(item, index) in vesselInfoFields"
          >
            <label class="font-medium text-neutral-500"
              >{{ item.label }}:
            </label>
            <DatePicker
              v-if="item.type === 'datePickerRange'"
              v-model="formData[item.model]"
              selectionMode="range"
              :manualInput="false"
              showIcon
              iconDisplay="input"
              :placeholder="item.placeholder"
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

          
          <div class="flex justify-end pt-4">
            <Button label="Submit" size="small" @click="handleSubmitReport" />
          </div>
        </div>

        <Tabs class="pt-14" value="0">
          <TabList>
            <Tab value="0">Visitation Details</Tab>
            <Tab value="1">Sections</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <div class="flex flex-col w-full space-y-6 pt-10">
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
                        filter
                      />
                    </div>

                    <!-- Divider for ungrouped fields -->
                    <div class="pt-4">
                      <Divider v-if="!item.group_input" />
                    </div>
                  </template>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="1">
              <!-- //* SECTIONS FIELDS -->
              <div class="pt-10">
                <div class="w-full space-y-8 text-sm">
                  <div
                    v-for="(section, sIndex) in preDefineSections"
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
                            icon="pi pi-pencil"
                            variant="outlined"
                            severity="secondary"
                            aria-label="Edit details"
                            size="small"
                            @click="openUpdateSectionModal(section)"
                          />
                          <Button
                            icon="pi pi-trash"
                            variant="outlined"
                            severity="danger"
                            aria-label="Delete details"
                            size="small"
                            @click="deleteSection(section)"
                          />
                        </div>
                      </div>
                      <div class="gap-y-2 mt-1">
                        <Textarea
                          v-model="section.details"
                          rows="2"
                          size="small"
                          :placeholder="
                            !section.details && 'Provide basic details'
                          "
                          class="w-full text-sm"
                          autoResize
                        />
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
                            variant="link"
                            label="Edit details"
                            size="small"
                            @click="startChildEditing(child)"
                          />
                          <Button
                            v-if="child.category_key === 'custom_child'"
                            variant="link"
                            label="Delete"
                            size="small"
                            @click="handleRemove(section, child)"
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
                        size="small"
                        label="Add section"
                        variant="outlined"
                        @click="openAddSectionModal(section)"
                      />
                    </div>
                  </div>
                </div>
                <div class="w-full flex justify-center m-0 pt-6">
                  <Button
                    label="Add New Section"
                    size="small"
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
            @click="submitSection"
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
              @click="submitSection"
            />
          </div>
        </div>
      </template>
    </div>
  </Dialog>
</template>
