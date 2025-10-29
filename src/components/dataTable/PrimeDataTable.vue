<script setup>
import ColumnActions from "./ColumnActions.vue";

defineProps({
  rowData: Array,
  colData: Array,
  total: Number,
  perPage: Number,
  page: Number,
  tableName: String,
  loading: Boolean,
});

const emit = defineEmits(["page", "action", "search", "view"]);
function handlePage(event) {
  emit("page", event);
}
</script>

<template>
  <DataTable
    :key="page"
    :value="rowData"
    paginator
    :rows="perPage"
    :first="(page - 1) * perPage"
    :totalRecords="total"
    size="small"
    lazy
    :loading="loading"
    @page="handlePage"
  >
    <template #header>
      <div class="flex flex-wrap items-center justify-between mb-4">
        <span class="text-xl font-bold text-neutral-500">{{ tableName }}</span>
      </div>
    </template>
    <Column
      v-for="col of colData"
      :key="col.field"
      :field="col.field"
      :header="col.header"
    >
      <template #body="slotProps" v-if="col.field === 'actions'">
        <ColumnActions :row="slotProps.data" />
      </template>
    </Column>
  </DataTable>
</template>
