import { defineStore } from "pinia";
import { api } from "@/service/http";
import {
  PARTICIPANTS_ENDPOINTS,
  PERSONS_ENDPOINTS,
  REPORT_ENDPOINTS,
  SECTIONS_MANAGEMENT_ENDPOINTS,
} from "@/apis/endpoints";

export const usePersonStore = defineStore("personStore", {
  state: () => ({
    user: null,
    token: localStorage.getItem("auth.token") || null,
    loading: false,
    success: null,
    message: null,
    error: null,
    data: [],
    personDetails: {},

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
    async fetchPersons(page, search, type, filters) {
      this.loading = true;
      try {
        const { data: json } = await api.get(PERSONS_ENDPOINTS.GET_PERSONS, {
          params: { format: "flat", filters: filters, page: page },
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

    //* CRUD
    async addPerson(payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "add-person",
      };
      try {
        const { data } = await api.post(PERSONS_ENDPOINTS.ADD_PERSON, payload);

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "Successfully Added Person.",
          type: "add-person",
        };
        await this.fetchPersons(reportId);
      } catch (error) {
        console.error("❌ addPerson error:", error);
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "add-person",
        };
      }
    },
    async updatePerson(id, payload) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "update-person",
      };
      try {
        const { data } = await api.put(
          PERSONS_ENDPOINTS.UPDATE_PERSON(id),
          payload
        );

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "Successfully Update Person Details.",
          type: "update-person",
        };

        await this.fetchPersons();
      } catch (error) {
        console.error("❌ update Person error:", error);
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "update-person",
        };
      }
    },

    async viewPerson(id) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "view-person",
      };
      try {
        const { data } = await api.get(PERSONS_ENDPOINTS.VIEW_PERSON(id));

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "Successfully View Person Details.",
          type: "view-person",
        };
        // this.personDetails = data ?? [];
        this.personDetails = {
          id: data.id,
          ...data.values,
        };
      } catch (error) {
        console.error("❌ view Person error:", error);
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "view-person",
        };
      }
    },

    async deletePerson(id) {
      this.operation = {
        loading: true,
        success: false,
        isError: false,
        message: "",
        type: "delete-person",
      };
      try {
        const { data } = await api.delete(PERSONS_ENDPOINTS.DELETE_PERSON(id));

        this.operation = {
          loading: false,
          success: true,
          isError: false,
          message: "Successfully Deleted Person Details.",
          type: "delete-person",
        };

        await this.fetchPersons();
      } catch (error) {
        console.error("❌ delete Person error:", error);
      } finally {
        this.operation = {
          loading: false,
          success: false,
          isError: false,
          message: "",
          type: "delete-person",
        };
      }
    },
  },
});
