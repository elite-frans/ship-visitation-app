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
    async fetchPersons(page, search, type, filters) {
      this.loading = true;
      try {
        const { data: json } = await api.get(PERSONS_ENDPOINTS.GET_PERSONS, {
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
  },
});
