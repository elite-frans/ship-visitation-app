<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Menu from "primevue/menu";
import Button from "primevue/button";
import { useShipReportStore } from "@/stores/shipReportStore";

const props = defineProps({
  row: { type: Object, required: true },
});

const router = useRouter();
const menu = ref();
const shipReportStore = useShipReportStore();

const handleView = () => {
  router.push({ name: "ShipReportView", params: { id: props.row.id } });
};

const handleViewNewTab = () => {
  const url = router.resolve({
    name: "ShipReportView",
    params: { id: props.row.id },
  }).href;
  window.open(url, "_blank");
};

const handleDelete = () => {
  shipReportStore.deleteReport(props.row.id);
};

const items = ref([
  {
    label: "Actions",
    items: [
      {
        label: "View",
        icon: "pi pi-eye",
        command: handleView,
      },
      {
        label: "View on New Tab",
        icon: "pi pi-external-link",
        command: handleViewNewTab,
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: handleDelete,
      },
    ],
  },
]);

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>

<template>
  <div>
    <Button
      size="small"
      type="button"
      icon="pi pi-ellipsis-h"
      severity="secondary"
      variant="outlined"
      @click="toggle"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>
