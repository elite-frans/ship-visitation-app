export const REPORT_ENDPOINTS = {
  GET_REPORTS: "/api/spa/reports?",
  VIEW_REPORT: (id) => `/api/spa/reports/${id}`,
  DELETE_REPORT: (id) => `/api/spa/reports/${id}`,
};

export const SECTIONS_MANAGEMENT_ENDPOINTS = {
  ADD_SECTION: (id) => `api/spa/reports/${id}/sections`,
  UPDATE_SECTION: (id) => `api/spa/reports/${id}`,
  DELETE_DETAIL: (id) => `api/spa/reports/${id}`,
  ADD_CUSTOM_SECTION: (id) => `api/spa/reports/${id}`,
};
