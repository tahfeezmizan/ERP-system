import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/rootReducer";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.tokens?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      const companyId = state.auth.companyId;
      if (companyId) {
        headers.set("X-Company-Id", companyId);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Auth",
    "Dashboard",
    "Land",
    "Project",
    "Property",
    "Lease",
    "Tenant",
    "Vendor",
    "CRM",
    "Booking",
    "Collection",
    "Customer",
    "Construction",
    "Procurement",
    "Inventory",
    "Contractor",
    "Finance",
    "HR",
    "Maintenance",
    "Report",
    "Notification",
    "Task",
    "Document",
  ],
  endpoints: () => ({}),
});
