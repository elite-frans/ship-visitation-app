export const REPORT_ENDPOINTS = {
  GET_REPORTS: "/api/spa/reports?",
  VIEW_REPORT: (id) => `/api/spa/reports/${id}`,
  DELETE_REPORT: (id) => `/api/spa/reports/${id}`,
};

export const SECTIONS_MANAGEMENT_ENDPOINTS = {
  ADD_SECTION: (id) => `api/spa/reports/${id}/sections`,
  UPDATE_SECTION: (id) => `api/spa/reports/${id}`,
  ADD_CUSTOM_SECTION: (id) => `api/spa/reports/${id}`,
  DELETE_SECTION: (id) => `api/spa/reports/${id}`,
};

export const PARTICIPANTS_ENDPOINTS = {
  ADD_PARTICIPANT: (id) => `api/spa/reports/${id}`,
  UPDATE_PARTICIPANT: (id) => `api/spa/reports/${id}`,
  DELETE_PARTICIPANT: (id) => `api/spa/reports/${id}`,
  REMOVE_ALL_PARTICIPANT: (id) => `api/spa/reports/${id}`,
  RETAIN_SELECTED_PARTICIPANT: (id) => `api/spa/reports/${id}`,
};

export const PERSONS_ENDPOINTS = {
  GET_PERSONS: "/api/spa/persons?",
  GET_PERSON_COMPANY: (companyName) =>
    `/api/spa/persons?filter[company]=${companyName}`,
  GET_COMPANIES: "/api/spa/persons/companies",
  ADD_PERSON: "/api/spa/persons",
  UPDATE_PERSON: (id) => `/api/spa/persons/${id}`,
  DELETE_PERSON: (id) => `/api/spa/persons/${id}`,
  VIEW_PERSON: (id) => `/api/spa/persons/${id}`,
};

export const OPEN_APIS = {
  GET_API_KEYS: "api/spa/open-apis/keys",
};
