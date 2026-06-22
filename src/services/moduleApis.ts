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
import type { Booking, Collection, Customer, Lead, LandRecord, PaginatedResponse, PropertyUnit, Project } from "@/types";
import type { CreateCustomerFormData } from "@/schemas/customer";
import type {
  CreateLandRecordFormData,
  CreateLeadFormData,
  CreateBookingFormData,
  CreateCollectionFormData,
  CreateContractorFormData,
  CreateEmployeeFormData,
  CreatePropertyUnitFormData,
  CreateProjectFormData,
  CreateProcurementFormData,
  CreateInventoryItemFormData,
  CreateJournalEntryFormData,
  CreateComplaintFormData,
  CreateMilestoneFormData,
} from "@/schemas";
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
    createLandRecord: builder.mutation<LandRecord, CreateLandRecordFormData>({
      queryFn: async (data) => {
        await delay(400);
        const newRecord: LandRecord = {
          id: `land_${Math.random().toString(36).slice(2, 10)}`,
          owners: [],
          ...data,
        };
        mockLandRecords.push(newRecord);
        return { data: newRecord };
      },
      invalidatesTags: ["Land"],
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
    createProject: builder.mutation<Project, CreateProjectFormData>({
      queryFn: async (data) => {
        await delay(400);
        const newProject: Project = {
          id: `proj_${Math.random().toString(36).slice(2, 10)}`,
          status: "Planning",
          spent: 0,
          completionPercent: 0,
          ...data,
        };
        mockProjects.push(newProject);
        return { data: newProject };
      },
      invalidatesTags: ["Project"],
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
    createUnit: builder.mutation<PropertyUnit, CreatePropertyUnitFormData>({
      queryFn: async (data) => {
        await delay(400);
        const newUnit: PropertyUnit = {
          id: `unit_${Math.random().toString(36).slice(2, 10)}`,
          projectId: `proj_${Math.random().toString(36).slice(2, 6)}`,
          status: "Available",
          ...data,
        };
        mockUnits.push(newUnit);
        return { data: newUnit };
      },
      invalidatesTags: ["Property"],
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
    createLead: builder.mutation<Lead, CreateLeadFormData>({
      queryFn: async (data) => {
        await delay(400);
        const newLead: Lead = {
          id: `lead_${Math.random().toString(36).slice(2, 10)}`,
          stage: "Lead",
          createdAt: new Date().toISOString().slice(0, 10),
          ...data,
        };
        mockLeads.push(newLead);
        return { data: newLead };
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
    createBooking: builder.mutation<Booking, CreateBookingFormData>({
      queryFn: async (data) => {
        await delay(400);
        const seq = mockBookings.length + 1;
        const newBooking: Booking = {
          id: `book_${Math.random().toString(36).slice(2, 10)}`,
          bookingNo: `BK-2025-${String(seq).padStart(3, "0")}`,
          customerId: `cust_${Math.random().toString(36).slice(2, 6)}`,
          unitId: `unit_${Math.random().toString(36).slice(2, 6)}`,
          status: "Pending",
          ...data,
        };
        mockBookings.push(newBooking);
        return { data: newBooking };
      },
      invalidatesTags: ["Booking"],
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
    createCollection: builder.mutation<Collection, CreateCollectionFormData>({
      queryFn: async (data) => {
        await delay(400);
        const seq = mockCollections.length + 1;
        const newCollection: Collection = {
          id: `coll_${Math.random().toString(36).slice(2, 10)}`,
          receiptNo: `MR-2025-${String(seq).padStart(3, "0")}`,
          bookingId: `book_${Math.random().toString(36).slice(2, 6)}`,
          status: "Received",
          ...data,
        };
        mockCollections.push(newCollection);
        return { data: newCollection };
      },
      invalidatesTags: ["Collection"],
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
    createOrder: builder.mutation<(typeof mockProcurementOrders)[0], CreateProcurementFormData>({
      queryFn: async (data) => {
        await delay(400);
        const seq = mockProcurementOrders.length + 1;
        const newOrder = {
          id: `po_${Math.random().toString(36).slice(2, 10)}`,
          poNo: `PO-2025-${String(seq).padStart(3, "0")}`,
          status: "Pending",
          vendor: data.vendor,
          amount: data.amount,
          date: data.date,
        };
        mockProcurementOrders.push(newOrder);
        return { data: newOrder };
      },
      invalidatesTags: ["Procurement"],
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
    createItem: builder.mutation<(typeof mockInventoryItems)[0], CreateInventoryItemFormData>({
      queryFn: async (data) => {
        await delay(400);
        const newItem = {
          id: `inv_${Math.random().toString(36).slice(2, 10)}`,
          ...data,
        };
        mockInventoryItems.push(newItem);
        return { data: newItem };
      },
      invalidatesTags: ["Inventory"],
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
    createContractor: builder.mutation<(typeof mockContractors)[0], CreateContractorFormData>({
      queryFn: async (data) => {
        await delay(400);
        const newContractor = {
          id: `con_${Math.random().toString(36).slice(2, 10)}`,
          activeProjects: 0,
          pendingBills: 0,
          ...data,
        };
        mockContractors.push(newContractor);
        return { data: newContractor };
      },
      invalidatesTags: ["Contractor"],
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
    createJournalEntry: builder.mutation<(typeof mockFinanceAccounts)[0], CreateJournalEntryFormData>({
      queryFn: async (data) => {
        await delay(400);
        const newEntry = {
          id: `acc_${Math.random().toString(36).slice(2, 10)}`,
          code: data.accountCode,
          name: data.accountName,
          type: data.type,
          balance: data.balance,
        };
        mockFinanceAccounts.push(newEntry);
        return { data: newEntry };
      },
      invalidatesTags: ["Finance"],
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
    createEmployee: builder.mutation<(typeof mockEmployees)[0], CreateEmployeeFormData>({
      queryFn: async (data) => {
        await delay(400);
        const newEmployee = {
          id: `emp_${Math.random().toString(36).slice(2, 10)}`,
          status: "Active",
          name: data.name,
          department: data.department,
          designation: data.designation,
        };
        mockEmployees.push(newEmployee);
        return { data: newEmployee };
      },
      invalidatesTags: ["HR"],
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
    createComplaint: builder.mutation<(typeof mockComplaints)[0], CreateComplaintFormData>({
      queryFn: async (data) => {
        await delay(400);
        const seq = mockComplaints.length + 1;
        const newComplaint = {
          id: `comp_${Math.random().toString(36).slice(2, 10)}`,
          ticketNo: `TKT-${String(seq).padStart(3, "0")}`,
          status: "Open",
          ...data,
        };
        mockComplaints.push(newComplaint);
        return { data: newComplaint };
      },
      invalidatesTags: ["Maintenance"],
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
  useCreateLandRecordMutation,
} = landApi;

export const { useGetProjectsQuery, useCreateProjectMutation } = projectApi;
export const { useGetUnitsQuery, useCreateUnitMutation } = propertyApi;
export const {
  useGetLeadsQuery,
  useGetPipelineQuery,
  useUpdateLeadStageMutation,
  useCreateLeadMutation,
} = crmApi;
export const { useGetBookingsQuery, useCreateBookingMutation } = bookingApi;
export const { useGetCollectionsQuery, useCreateCollectionMutation } = collectionApi;
export const { useGetCustomersQuery, useCreateCustomerMutation } = customerApi;
export const { useGetProgressQuery } = constructionApi;
export const { useGetOrdersQuery, useCreateOrderMutation } = procurementApi;
export const { useGetItemsQuery, useCreateItemMutation } = inventoryApi;
export const { useGetContractorsQuery, useCreateContractorMutation } = contractorApi;
export const { useGetAccountsQuery, useCreateJournalEntryMutation } = financeApi;
export const { useGetEmployeesQuery, useCreateEmployeeMutation } = hrApi;
export const { useGetComplaintsQuery, useCreateComplaintMutation } = maintenanceApi;
export const { useGetSalesReportQuery } = reportApi;
