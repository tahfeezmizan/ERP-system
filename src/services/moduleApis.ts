import { baseApi } from "./baseApi";
import { delay } from "@/lib/utils";
import {
  mockBookings,
  mockCollections,
  mockComplaints,
  mockConstructionProgress,
  mockContractors,
  mockCustomers,
  mockEmployees,
  mockFinanceAccounts,
  mockInventoryItems,
  mockLandRecords,
  mockLeads,
  mockProcurementOrders,
  mockProjects,
  mockUnits,
} from "@/lib/mock-data";
import type { Customer, Lead, PaginatedResponse } from "@/types";
import type { CreateCustomerFormData } from "@/schemas/customer";
import { CRM_PIPELINE_STAGES } from "@/constants/app";

function paginate<T>(data: T[], page = 1, pageSize = 10): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return {
    data: data.slice(start, start + pageSize),
    total: data.length,
    page,
    pageSize,
  };
}

export const landApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLandRecords: builder.query<typeof mockLandRecords, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockLandRecords };
      },
      providesTags: ["Land"],
    }),
  }),
});

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<typeof mockProjects, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockProjects };
      },
      providesTags: ["Project"],
    }),
  }),
});

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUnits: builder.query<typeof mockUnits, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockUnits };
      },
      providesTags: ["Property"],
    }),
  }),
});

export const crmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<typeof mockLeads, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockLeads };
      },
      providesTags: ["CRM"],
    }),
    getPipeline: builder.query<Record<string, Lead[]>, void>({
      queryFn: async () => {
        await delay(400);
        const pipeline: Record<string, Lead[]> = {};
        CRM_PIPELINE_STAGES.forEach((stage) => {
          pipeline[stage] = mockLeads.filter((l) => l.stage === stage);
        });
        return { data: pipeline };
      },
      providesTags: ["CRM"],
    }),
    updateLeadStage: builder.mutation<
      Lead,
      { id: string; stage: Lead["stage"] }
    >({
      queryFn: async ({ id, stage }) => {
        await delay(300);
        const lead = mockLeads.find((l) => l.id === id);
        if (!lead) {
          return { error: { status: 404, data: { message: "Lead not found" } } };
        }
        return { data: { ...lead, stage } };
      },
      invalidatesTags: ["CRM"],
    }),
  }),
});

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<typeof mockBookings, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockBookings };
      },
      providesTags: ["Booking"],
    }),
  }),
});

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<typeof mockCollections, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockCollections };
      },
      providesTags: ["Collection"],
    }),
  }),
});

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<typeof mockCustomers, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockCustomers };
      },
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerFormData>({
      queryFn: async (customer) => {
        await delay(400);
        const newCustomer: Customer = {
          id: `cust_${Math.random().toString(36).slice(2, 10)}`,
          totalPaid: 0,
          totalDue: 0,
          status: "Active",
          ...customer,
        };
        mockCustomers.push(newCustomer);
        return { data: newCustomer };
      },
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const constructionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProgress: builder.query<typeof mockConstructionProgress, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockConstructionProgress };
      },
      providesTags: ["Construction"],
    }),
  }),
});

export const procurementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<typeof mockProcurementOrders, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockProcurementOrders };
      },
      providesTags: ["Procurement"],
    }),
  }),
});

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<typeof mockInventoryItems, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockInventoryItems };
      },
      providesTags: ["Inventory"],
    }),
  }),
});

export const contractorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContractors: builder.query<typeof mockContractors, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockContractors };
      },
      providesTags: ["Contractor"],
    }),
  }),
});

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<typeof mockFinanceAccounts, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockFinanceAccounts };
      },
      providesTags: ["Finance"],
    }),
  }),
});

export const hrApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<typeof mockEmployees, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockEmployees };
      },
      providesTags: ["HR"],
    }),
  }),
});

export const maintenanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplaints: builder.query<typeof mockComplaints, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockComplaints };
      },
      providesTags: ["Maintenance"],
    }),
  }),
});

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query<
      PaginatedResponse<(typeof mockBookings)[0]>,
      { page?: number; pageSize?: number }
    >({
      queryFn: async ({ page = 1, pageSize = 10 }) => {
        await delay(400);
        return { data: paginate(mockBookings, page, pageSize) };
      },
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useGetLandRecordsQuery,
} = landApi;

export const { useGetProjectsQuery } = projectApi;
export const { useGetUnitsQuery } = propertyApi;
export const {
  useGetLeadsQuery,
  useGetPipelineQuery,
  useUpdateLeadStageMutation,
} = crmApi;
export const { useGetBookingsQuery } = bookingApi;
export const { useGetCollectionsQuery } = collectionApi;
export const { useGetCustomersQuery, useCreateCustomerMutation } = customerApi;
export const { useGetProgressQuery } = constructionApi;
export const { useGetOrdersQuery } = procurementApi;
export const { useGetItemsQuery } = inventoryApi;
export const { useGetContractorsQuery } = contractorApi;
export const { useGetAccountsQuery } = financeApi;
export const { useGetEmployeesQuery } = hrApi;
export const { useGetComplaintsQuery } = maintenanceApi;
export const { useGetSalesReportQuery } = reportApi;
