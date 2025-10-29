import { defineStore } from "pinia";
import { api } from "@/service/http";
import {
  PARTICIPANTS_ENDPOINTS,
  REPORT_ENDPOINTS,
  SECTIONS_MANAGEMENT_ENDPOINTS,
} from "@/apis/endpoints";

export const useShipReportStore = defineStore("shipReportStore", {
  state: () => ({
    user: null,
    token: localStorage.getItem("auth.token") || null,
    loading: false,
    success: null,
    message: null,
    error: null,
    data: [],
    report: null,

    perPage: 15,
    page: 1,
    total: 0,

    operation: {
      loading: false,
      success: false,
      isError: false,
      message: "",
      errorMessages: null,
      type: null,
    },
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user) || Boolean(state.token),
  },
  actions: {
    async fetchReports(page, search, type, filters) {
      this.loading = true;
      try {
        const { data: json } = await api.get(REPORT_ENDPOINTS.GET_REPORTS, {
          params: { format: "flat", filters: filters },
        });

        this.data = json.data ?? [];
        this.total = json.total ?? 0;
        this.perPage = json.per_page ?? 15;
        this.page = json.current_page ?? nextPage;
      } catch (error) {
        this.error =
          err?.response?.data || err.message || "Something went wrong.";
      } finally {
        this.loading = false;
      }
    },
    async viewReport(id, filters) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "view",
      };
      try {
        const { data: json } = await api.get(REPORT_ENDPOINTS.VIEW_REPORT(id), {
          params: { format: "flat", filters: filters },
        });

        this.report = json ?? [];
        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "Successfully view report.",
          type: "view",
        };
      } catch (error) {
        this.error =
          err?.response?.data || err.message || "Something went wrong.";
      } finally {
        this.loading = false;
      }
    },
    async deleteReport(id) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "delete",
      };
      try {
        const { data } = await api.delete(REPORT_ENDPOINTS.VIEW_REPORT(id));

        this.operation = {
          loading: false,
          success: true,
          message: data.message,
          type: "delete",
        };
        await this.fetchReports();
        return data;
      } catch (error) {
        this.error =
          err?.response?.data || err.message || "Something went wrong.";
      } finally {
        this.loading = false;
      }
    },

    //* SECTIONS
    async addNewSection(id, payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "add-section",
      };
      try {
        const { data } = await api.post(
          SECTIONS_MANAGEMENT_ENDPOINTS.ADD_SECTION(id),
          payload
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "add-section",
        };
        await this.viewReport(id);
      } catch (error) {
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "update-section",
        };
      }
    },
    async addNewCustomSection(id, payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "add-custom-section",
      };
      try {
        const { data } = await api.put(
          SECTIONS_MANAGEMENT_ENDPOINTS.ADD_CUSTOM_SECTION(id),
          payload
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "add-custom-section",
        };
        await this.viewReport(id);
      } catch (error) {
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "add-custom-section",
        };
      }
    },
    async updateSection(id, payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "update-section",
      };
      try {
        const { data } = await api.put(
          SECTIONS_MANAGEMENT_ENDPOINTS.UPDATE_SECTION(id),
          payload
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "update-section",
        };

        await this.viewReport(id);
      } catch (error) {
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "update-section",
        };
      }
    },
    async deleteCustomSection(reportId, id) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "delete-detail",
      };
      try {
        const { data } = await api.delete(
          SECTIONS_MANAGEMENT_ENDPOINTS.DELETE_SECTION(id)
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "delete-section",
        };

        await this.viewReport(reportId);
      } catch (error) {
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "delete-section",
        };
      }
    },

    //* PARTICIPANTS
    async addParticipant(reportId, payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "add-participant",
      };
      try {
        const { data } = await api.put(
          PARTICIPANTS_ENDPOINTS.ADD_PARTICIPANT(reportId),
          payload
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "add-participant",
        };
        await this.viewReport(reportId);
      } catch (error) {
        console.error("❌ addParticipant error:", error);
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "add-participant",
        };
      }
    },

    //* PARTICIPANTS
    async updateParticipant(reportId, payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "update-participant",
      };
      try {
        const { data } = await api.put(
          PARTICIPANTS_ENDPOINTS.UPDATE_PARTICIPANT(reportId),
          payload
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "update-participant",
        };
        await this.viewReport(reportId);
      } catch (error) {
        console.error("updateParticipant error:", error);
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "update-participant",
        };
      }
    },
  },
});
