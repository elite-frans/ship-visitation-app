<script setup>
import { useShipReport } from "@/composables/shipReport/useShipReport";
import PrimeDataTable from "@/components/dataTable/PrimeDataTable.vue";
import { useShipReportStore } from "@/stores/shipReportStore";
import { useDataTableHandler } from "@/composables/dataTable/useDataTableHandler";
import { usePersonStore } from "@/stores/personStore";
import { usePerson } from "@/composables/persons/usePerson";

const personStore = usePersonStore();
const { personCols } = usePerson();

const { onPage, onSearch } = useDataTableHandler(personStore, "fetchReports");
</script>

<template>
  <div class="w-full h-screen">
    <div class="card w-full h-full">
      <div>
        <PrimeDataTable
          tableName="Persons"
          :loading="personStore.loading ||personStore.operation.loading"
          :rowData="personStore.data"
          :colData="personCols"
          :total="personStore.total"
          :perPage="personStore.perPage"
          :page="personStore.page"
          @page="onPage"
        />
      </div>
    </div>
  </div>
</template>
