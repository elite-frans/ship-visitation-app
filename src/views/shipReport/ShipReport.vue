<script setup>
import { useShipReport } from "@/composables/shipReport/useShipReport";
import PrimeDataTable from "@/components/dataTable/PrimeDataTable.vue";
import { useShipReportStore } from "@/stores/shipReportStore";
import { useDataTableHandler } from "@/composables/dataTable/useDataTableHandler";

const shipReport = useShipReportStore();
const { shipReportCol } = useShipReport();

const { onPage, onSearch } = useDataTableHandler(shipReport, "fetchReports");
</script>

<template>
  <div class="w-full h-screen">
    <div class="card w-full h-full">
      <div>
        <PrimeDataTable
          tableName="Ship Visitation Reports"
          :loading="shipReport.loading ||shipReport.operation.loading"
          :rowData="shipReport.data"
          :colData="shipReportCol"
          :total="shipReport.total"
          :perPage="shipReport.perPage"
          :page="shipReport.page"
          @page="onPage"
        />
      </div>
    </div>
  </div>
</template>
