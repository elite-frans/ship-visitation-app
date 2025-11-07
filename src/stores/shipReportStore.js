import { defineStore } from "pinia";
import { api } from "@/service/http";
import {
  OPEN_APIS,
  PARTICIPANTS_ENDPOINTS,
  PERSONS_ENDPOINTS,
  REPORT_ENDPOINTS,
  SECTIONS_MANAGEMENT_ENDPOINTS,
  THIRD_PARTY_APIS,
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
    companies: [],
    participants: [],
    apiKeys: {},
    onBoardCrews: [],
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
    isLoading: (state) => {
      return (type) => state.operation.loading && state.operation.type === type;
    },
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
    async fetchCompanies() {
      if (this.companiesLoaded && this.companies.length > 0) {
        return this.companies;
      }
      this.loading = true;
      try {
        const { data: json } = await api.get(PERSONS_ENDPOINTS.GET_COMPANIES);

        this.companies = (json.data ?? []).map((item) => ({
          name: item,
          value: item,
        }));

        this.companiesLoaded = true;
        return this.companies;
      } catch (err) {
        this.error =
          err?.response?.data || err.message || "Something went wrong.";
      } finally {
        this.loading = false;
      }
    },

    async fetchOpenApiKeys() {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "fetch-api-keys",
      };
      try {
        const { data } = await api.get(OPEN_APIS.GET_API_KEYS);
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "fetch-api-keys",
        };

        this.apiKeys = data?.data;

        return this.apiKeys;
      } catch (err) {
        this.operation.isError = true;
        this.operation.message = err?.response?.data || err.message;
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "fetch-api-keys",
        };
      }
    },

    async fetchOnBoardCrews(vesselName) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "fetch-onboard-crew",
      };
      try {
        const { data } = await api.get(THIRD_PARTY_APIS.GET_ONBOARD_CREWS, {
          params: {
            vessel_name: vesselName,
          },
        });
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "fetch-onboard-crew",
        };

        this.onBoardCrews = data?.data;

        return this.onBoardCrews;
      } catch (err) {
        this.operation.isError = true;
        this.operation.message = err?.response?.data || err.message;
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "fetch-onboard-crew",
        };
      }
    },
    async fetchParticipantsByCompany(companyName) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "participant-selection",
      };
      try {
        const url = PERSONS_ENDPOINTS.GET_PERSON_COMPANY(companyName);
        const { data: json } = await api.get(url, {
          params: { format: "flat" },
        });

        this.participants = (json.data ?? []).map((item) => ({
          name: `${item.first_name} ${item.last_name}`,
          value: item.id,
          ...item,
        }));

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "participant-selection",
        };
        return this.participants;
      } catch (err) {
        this.error =
          err?.response?.data || err.message || "Something went wrong.";
        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "participant-selection",
        };
      } finally {
        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "participant-selection",
        };
      }
    },

    async createReport(payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "create-report",
      };
      try {
        const { data: json } = await api.post(
          REPORT_ENDPOINTS.CREATE_REPORTS,
          payload
        );

        this.report = json ?? [];
        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "Successfully created report.",
          type: "created-report",
        };
      } catch (error) {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message:
            err?.response?.data || err.message || "Something went wrong.",
          type: "create-report",
        };
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "create-report",
        };
      }
    },

    async updateReport(payload, id) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "update-report",
      };
      try {
        const { data: json } = await api.put(
          REPORT_ENDPOINTS.UPDATE_REPORT(id),
          payload
        );

        this.report = json ?? [];
        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "Successfully created report.",
          type: "update-report",
        };
        await this.viewReport(id);
      } catch (error) {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message:
            err?.response?.data || err.message || "Something went wrong.",
          type: "update-report",
        };
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "update-report",
        };
      }
    },

    async viewReport(id, filters) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "view-report",
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
          type: "view-report",
        };
      } catch (error) {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message:
            err?.response?.data || err.message || "Something went wrong.",
          type: "view-report",
        };
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "view-report",
        };
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
        type: "add-section-detail",
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
          message: "Successfully Added Detail.",
          type: "add-section-detail",
        };
        await this.viewReport(id);
      } catch (error) {
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "add-section-detail",
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
          message: "Successfuly Updated Section.",
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
          message: "Successfully Added Visitor.",
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

    async deleteParticipant(reportId, payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "delete-participant",
      };
      try {
        const { data } = await api.put(
          PARTICIPANTS_ENDPOINTS.DELETE_PARTICIPANT(reportId),
          payload
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "",
          type: "delete-participant",
        };
        await this.viewReport(reportId);
      } catch (error) {
        console.error("deleteParticipant error:", error);
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "delete-participant",
        };
      }
    },

    async removeAllParticipant(reportId) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "remove-all-participant",
      };

      try {
        const payload = { participants: [] };

        const { data } = await api.put(
          PARTICIPANTS_ENDPOINTS.REMOVE_ALL_PARTICIPANT(reportId),
          payload
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "Successfully Removed All Visitors.",
          type: "remove-all-participant",
        };

        await this.viewReport(reportId);
      } catch (error) {
        console.error("removeAllParticipant error:", error);

        this.operation = {
          loading: false,
          success: false,
          isError: true,
          message:
            error.response?.data?.message || "Failed to remove participants",
          type: "remove-all-participant",
        };
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          type: "remove-all-participant",
        };
      }
    },

    async retainSelectedParticipants(reportId, payload) {
      this.operation = {
        loading: true,
        success: false,
        type: "retain-selected-participants",
      };
      try {
        const { data } = await api.put(
          PARTICIPANTS_ENDPOINTS.RETAIN_SELECTED_PARTICIPANT(reportId),
          payload
        );
        await this.viewReport(reportId);
        this.operation = {
          loading: false,
          success: true,
          type: "retain-selected-participants",
        };
      } catch (error) {
        console.error("retainSelectedParticipants error:", error);
        this.operation = {
          loading: false,
          isError: true,
          type: "retain-selected-participants",
        };
      }
    },
  },
});
