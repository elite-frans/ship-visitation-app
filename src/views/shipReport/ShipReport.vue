<script setup>
import { useShipReport } from "@/composables/shipReport/useShipReport";
import PrimeDataTable from "@/components/dataTable/PrimeDataTable.vue";
import { useShipReportStore } from "@/stores/shipReportStore";
import { useDataTableHandler } from "@/composables/dataTable/useDataTableHandler";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal.vue";
import AddRecordPage from "@/components/addRecordPage/AddRecordPage.vue";

const shipReport = useShipReportStore();
const {
  shipReportCol,
  showDeleteDialog,
  colActionHandlers,
  rowToDelete,
  confirmDelete,
} = useShipReport(null, shipReport);

const { onPage, onSearch } = useDataTableHandler(shipReport, "fetchReports");
</script>

<template>
  <div class="w-full h-screen">
    <div class="card w-full h-full">
      <div>
        <PrimeDataTable
          tableName="Ship Visitation Reports"
          :loading="shipReport.loading || shipReport.operation.loading"
          :rowData="shipReport.data"
          :colData="shipReportCol"
          :total="shipReport.total"
          :perPage="shipReport.perPage"
          :page="shipReport.page"
          :headerButton="{
            component: AddRecordPage,
            props: { label: 'Create Report', routeName: 'CreateShipReport' },
          }"
          :actionHandlers="colActionHandlers"
          @page="onPage"
        />
      </div>
    </div>
  </div>
  <DeleteConfirmModal
    v-model="showDeleteDialog"
    :recordName="`Report`"
    title="Delete Report"
    @confirm="confirmDelete"
  />
</template>
