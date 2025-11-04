<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import Menu from "primevue/menu";
import Button from "primevue/button";
import { useShipReportStore } from "@/stores/shipReportStore";

const props = defineProps({
  row: { type: Object, required: true },
  handlers: Object, 
});

const router = useRouter();
const menu = ref();
// const shipReportStore = useShipReportStore();

const toggle = (event) => {
  menu.value.toggle(event);
};


const defaultActions = [
  {
    label: "View",
    icon: "pi pi-eye",
    command: () => router.push({ name: "ShipReportView", params: { id: props.row.id } }),
  },
  {
    label: "View on New Tab",
    icon: "pi pi-external-link",
    command: () => {
      const url = router.resolve({ name: "ShipReportView", params: { id: props.row.id } }).href;
      window.open(url, "_blank");
    },
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: () => shipReportStore.deleteReport(props.row.id),
  },
];


const menuItems = computed(() => {
  if (props.handlers?.getItems) {
    return props.handlers.getItems(props.row);
  }
  // return [{ label: "Actions", items: [] }];
    return [];
});
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
    <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
  </div>
</template>
