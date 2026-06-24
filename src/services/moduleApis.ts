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
  mockProperties,
  mockUnits,
} from "@/lib/mock-data";
import type { Booking, Collection, Customer, Lead, LandRecord, PaginatedResponse, Property, PropertyUnit } from "@/types";
import type { Project } from "@/app/(dashboard)/projects/model";
import type { CreateCustomerFormData } from "@/schemas/customer";
import type {
  CreateLandRecordFormData,
  CreateLeadFormData,
  CreateBookingFormData,
  CreateCollectionFormData,
  CreateContractorFormData,
  CreateEmployeeFormData,
  CreatePropertyUnitFormData,
  UnitFormData,
  PropertyFormData,
  CreateProjectFormData,
  CreateProcurementFormData,
  CreateInventoryItemFormData,
  CreateJournalEntryFormData,
  CreateComplaintFormData,
  CreateMilestoneFormData,
} from "@/schemas";
import { CRM_PIPELINE_STAGES } from "@/constants/app";
import {
  getLocalStorageData,
  setLocalStorageData,
  syncLandRecordSubkeys,
  syncPropertyUnitSubkeys,
} from "@/lib/storage-utils";

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
    getLandRecords: builder.query<LandRecord[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<LandRecord>("landRecords", mockLandRecords) };
      },
      providesTags: ["Land"],
    }),
    
    createLandRecord: builder.mutation<LandRecord, CreateLandRecordFormData>({
      queryFn: async (data) => {
        await delay(400);
        const records = [...getLocalStorageData<LandRecord>("landRecords", mockLandRecords)];
        const newRecord: LandRecord = {
          id: `land_${Math.random().toString(36).slice(2, 10)}`,
          owners: [],
          ...data,
        };
        // Inject timestamp as required
        (newRecord as any).createdAt = new Date().toISOString();
        records.push(newRecord);
        setLocalStorageData("landRecords", records);
        syncLandRecordSubkeys(records);
        return { data: newRecord };
      },
      invalidatesTags: ["Land"],
    }),

    updateLandRecord: builder.mutation<
      LandRecord,
      { id: string; data: CreateLandRecordFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const records = [...getLocalStorageData<LandRecord>("landRecords", mockLandRecords)];
        const index = records.findIndex((r) => r.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Land record not found" } };
        }
        const updated: LandRecord = {
          ...records[index],
          ...data,
          id,
          owners: records[index].owners,
        };
        records[index] = updated;
        setLocalStorageData("landRecords", records);
        syncLandRecordSubkeys(records);
        return { data: updated };
      },
      invalidatesTags: ["Land"],
    }),

    deleteLandRecord: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const records = getLocalStorageData<LandRecord>("landRecords", mockLandRecords);
        const filtered = records.filter((r) => r.id !== id);
        if (filtered.length === records.length) {
          return { error: { status: 404, data: "Land record not found" } };
        }
        setLocalStorageData("landRecords", filtered);
        syncLandRecordSubkeys(filtered);
        return { data: id };
      },
      invalidatesTags: ["Land"],
    }),
  }),
});

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<Project>("projects", mockProjects) };
      },
      providesTags: ["Project"],
    }),
    createProject: builder.mutation<Project, CreateProjectFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<Project>("projects", mockProjects)];
        const newProject: Project = {
          id: `proj_${Math.random().toString(36).slice(2, 10)}`,
          status: "Planning",
          spent: (data as any).actualCost ?? 0,
          completionPercent: 0,
          projectType: (data as any).projectType,
          landArea: (data as any).landArea,
          availableUnits: (data as any).availableUnits ?? 0,
          soldUnits: (data as any).soldUnits ?? 0,
          reservedUnits: (data as any).reservedUnits ?? 0,
          collectionAmount: (data as any).collectionAmount ?? 0,
          dueAmount: (data as any).dueAmount ?? 0,
          expectedCompletion: (data as any).expectedCompletion,
          projectManager: (data as any).projectManager,
          ...data,
        };
        (newProject as any).createdAt = new Date().toISOString();
        list.push(newProject);
        setLocalStorageData("projects", list);
        return { data: newProject };
      },
      invalidatesTags: ["Project"],
    }),
  }),
});

export const propertyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query<Property[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<Property>("properties", mockProperties) };
      },
      providesTags: ["Property"],
    }),
    createProperty: builder.mutation<Property, PropertyFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<Property>("properties", mockProperties)];
        const newProperty: Property = {
          id: `prop_${Math.random().toString(36).slice(2, 10)}`,
          ...data,
        };
        list.push(newProperty);
        setLocalStorageData("properties", list);
        return { data: newProperty };
      },
      invalidatesTags: ["Property"],
    }),
    updateProperty: builder.mutation<Property, { id: string; data: PropertyFormData }>({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [...getLocalStorageData<Property>("properties", mockProperties)];
        const index = list.findIndex((p) => p.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Property not found" } };
        }
        const updated: Property = { ...list[index], ...data, id };
        list[index] = updated;
        setLocalStorageData("properties", list);
        return { data: updated };
      },
      invalidatesTags: ["Property"],
    }),
    deleteProperty: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<Property>("properties", mockProperties);
        const filtered = list.filter((p) => p.id !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Property not found" } };
        }
        setLocalStorageData("properties", filtered);
        return { data: id };
      },
      invalidatesTags: ["Property"],
    }),
    getUnits: builder.query<PropertyUnit[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<PropertyUnit>("units", mockUnits) };
      },
      providesTags: ["Property"],
    }),
    createUnit: builder.mutation<PropertyUnit, UnitFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<PropertyUnit>("units", mockUnits)];
        const properties = getLocalStorageData<Property>("properties", mockProperties);
        const matchedProperty = properties.find((p) => p.name === data.propertyName);
        const newUnit: PropertyUnit = {
          id: `unit_${Math.random().toString(36).slice(2, 10)}`,
          propertyId: matchedProperty?.id,
          ...data,
        };
        list.push(newUnit);
        setLocalStorageData("units", list);
        syncPropertyUnitSubkeys(list);
        return { data: newUnit };
      },
      invalidatesTags: ["Property"],
    }),
    updateUnit: builder.mutation<PropertyUnit, { id: string; data: UnitFormData }>({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [...getLocalStorageData<PropertyUnit>("units", mockUnits)];
        const index = list.findIndex((u) => u.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Unit not found" } };
        }
        const properties = getLocalStorageData<Property>("properties", mockProperties);
        const matchedProperty = properties.find((p) => p.name === data.propertyName);
        const updated: PropertyUnit = {
          ...list[index],
          ...data,
          id,
          propertyId: matchedProperty?.id ?? list[index].propertyId,
        };
        list[index] = updated;
        setLocalStorageData("units", list);
        syncPropertyUnitSubkeys(list);
        return { data: updated };
      },
      invalidatesTags: ["Property"],
    }),
    deleteUnit: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<PropertyUnit>("units", mockUnits);
        const filtered = list.filter((u) => u.id !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Unit not found" } };
        }
        setLocalStorageData("units", filtered);
        syncPropertyUnitSubkeys(filtered);
        return { data: id };
      },
      invalidatesTags: ["Property"],
    }),
  }),
});

export const crmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query<Lead[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<Lead>("leads", mockLeads) };
      },
      providesTags: ["CRM"],
    }),
    getPipeline: builder.query<Record<string, Lead[]>, void>({
      queryFn: async () => {
        await delay(400);
        const leads = getLocalStorageData<Lead>("leads", mockLeads);
        const pipeline: Record<string, Lead[]> = {};
        CRM_PIPELINE_STAGES.forEach((stage) => {
          pipeline[stage] = leads.filter((l) => l.stage === stage);
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
        const leads = getLocalStorageData<Lead>("leads", mockLeads).map(l => ({ ...l }));
        const lead = leads.find((l) => l.id === id);
        if (!lead) {
          return { error: { status: 404, data: { message: "Lead not found" } } };
        }
        lead.stage = stage;
        lead.lastFollowUp = new Date().toISOString().slice(0, 10);
        setLocalStorageData("leads", leads);
        return { data: lead };
      },
      invalidatesTags: ["CRM"],
    }),
    createLead: builder.mutation<Lead, CreateLeadFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<Lead>("leads", mockLeads)];
        const newLead: Lead = {
          id: `lead_${Math.random().toString(36).slice(2, 10)}`,
          stage: "Lead",
          createdAt: new Date().toISOString().slice(0, 10),
          ...data,
        };
        list.push(newLead);
        setLocalStorageData("leads", list);
        return { data: newLead };
      },
      invalidatesTags: ["CRM"],
    }),
  }),
});

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<Booking>("bookings", mockBookings) };
      },
      providesTags: ["Booking"],
    }),
    createBooking: builder.mutation<Booking, CreateBookingFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<Booking>("bookings", mockBookings)];
        const seq = list.length + 1;
        const newBooking: Booking = {
          id: `book_${Math.random().toString(36).slice(2, 10)}`,
          bookingNo: `BK-2025-${String(seq).padStart(3, "0")}`,
          customerId: `cust_${Math.random().toString(36).slice(2, 6)}`,
          unitId: `unit_${Math.random().toString(36).slice(2, 6)}`,
          status: "Pending",
          ...data,
        };
        (newBooking as any).createdAt = new Date().toISOString();
        list.push(newBooking);
        setLocalStorageData("bookings", list);
        return { data: newBooking };
      },
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCollections: builder.query<Collection[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<Collection>("collections", mockCollections) };
      },
      providesTags: ["Collection"],
    }),
    createCollection: builder.mutation<Collection, CreateCollectionFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<Collection>("collections", mockCollections)];
        const seq = list.length + 1;
        const newCollection: Collection = {
          id: `coll_${Math.random().toString(36).slice(2, 10)}`,
          receiptNo: `MR-2025-${String(seq).padStart(3, "0")}`,
          bookingId: `book_${Math.random().toString(36).slice(2, 6)}`,
          status: "Received",
          ...data,
        };
        (newCollection as any).createdAt = new Date().toISOString();
        list.push(newCollection);
        setLocalStorageData("collections", list);
        return { data: newCollection };
      },
      invalidatesTags: ["Collection"],
    }),
  }),
});

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<Customer>("customers", mockCustomers) };
      },
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerFormData>({
      queryFn: async (customer) => {
        await delay(400);
        const list = [...getLocalStorageData<Customer>("customers", mockCustomers)];
        const newCustomer: Customer = {
          id: `cust_${Math.random().toString(36).slice(2, 10)}`,
          totalPaid: 0,
          totalDue: 0,
          status: "Active",
          ...customer,
        };
        (newCustomer as any).createdAt = new Date().toISOString();
        list.push(newCustomer);
        setLocalStorageData("customers", list);
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
    getOrders: builder.query<any[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<any>("vendors", mockProcurementOrders) };
      },
      providesTags: ["Procurement"],
    }),
    createOrder: builder.mutation<any, CreateProcurementFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<any>("vendors", mockProcurementOrders)];
        const seq = list.length + 1;
        const newOrder = {
          id: `po_${Math.random().toString(36).slice(2, 10)}`,
          poNo: `PO-2025-${String(seq).padStart(3, "0")}`,
          status: "Pending",
          vendor: data.vendor,
          amount: data.amount,
          date: data.date,
          createdAt: new Date().toISOString(),
        };
        list.push(newOrder);
        setLocalStorageData("vendors", list);
        return { data: newOrder };
      },
      invalidatesTags: ["Procurement"],
    }),
  }),
});

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<any[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<any>("inventory", mockInventoryItems) };
      },
      providesTags: ["Inventory"],
    }),
    createItem: builder.mutation<any, CreateInventoryItemFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<any>("inventory", mockInventoryItems)];
        const newItem = {
          id: `inv_${Math.random().toString(36).slice(2, 10)}`,
          createdAt: new Date().toISOString(),
          ...data,
        };
        list.push(newItem);
        setLocalStorageData("inventory", list);
        return { data: newItem };
      },
      invalidatesTags: ["Inventory"],
    }),
  }),
});

export const contractorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContractors: builder.query<any[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<any>("contractors", mockContractors) };
      },
      providesTags: ["Contractor"],
    }),
    createContractor: builder.mutation<any, CreateContractorFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<any>("contractors", mockContractors)];
        const newContractor = {
          id: `con_${Math.random().toString(36).slice(2, 10)}`,
          activeProjects: 0,
          pendingBills: 0,
          createdAt: new Date().toISOString(),
          ...data,
        };
        list.push(newContractor);
        setLocalStorageData("contractors", list);
        return { data: newContractor };
      },
      invalidatesTags: ["Contractor"],
    }),
  }),
});

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<any[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<any>("accounts", mockFinanceAccounts) };
      },
      providesTags: ["Finance"],
    }),
    createJournalEntry: builder.mutation<any, CreateJournalEntryFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<any>("accounts", mockFinanceAccounts)];
        const newEntry = {
          id: `acc_${Math.random().toString(36).slice(2, 10)}`,
          code: data.accountCode,
          name: data.accountName,
          type: data.type,
          balance: data.balance,
          createdAt: new Date().toISOString(),
        };
        list.push(newEntry);
        setLocalStorageData("accounts", list);
        return { data: newEntry };
      },
      invalidatesTags: ["Finance"],
    }),
  }),
});

export const hrApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<any[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<any>("employees", mockEmployees) };
      },
      providesTags: ["HR"],
    }),
    createEmployee: builder.mutation<any, CreateEmployeeFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<any>("employees", mockEmployees)];
        const newEmployee = {
          id: `emp_${Math.random().toString(36).slice(2, 10)}`,
          status: "Active",
          name: data.name,
          department: data.department,
          designation: data.designation,
          createdAt: new Date().toISOString(),
        };
        list.push(newEmployee);
        setLocalStorageData("employees", list);
        return { data: newEmployee };
      },
      invalidatesTags: ["HR"],
    }),
  }),
});

export const maintenanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComplaints: builder.query<any[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<any>("complaints", mockComplaints) };
      },
      providesTags: ["Maintenance"],
    }),
    createComplaint: builder.mutation<any, CreateComplaintFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<any>("complaints", mockComplaints)];
        const seq = list.length + 1;
        const newComplaint = {
          id: `comp_${Math.random().toString(36).slice(2, 10)}`,
          ticketNo: `TKT-${String(seq).padStart(3, "0")}`,
          status: "Open",
          createdAt: new Date().toISOString(),
          ...data,
        };
        list.push(newComplaint);
        setLocalStorageData("complaints", list);
        return { data: newComplaint };
      },
      invalidatesTags: ["Maintenance"],
    }),
  }),
});

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query<
      PaginatedResponse<Booking>,
      { page?: number; pageSize?: number }
    >({
      queryFn: async ({ page = 1, pageSize = 10 }) => {
        await delay(400);
        const bookings = getLocalStorageData<Booking>("bookings", mockBookings);
        return { data: paginate(bookings, page, pageSize) };
      },
      providesTags: ["Report"],
    }),
  }),
});

export const {
  useGetLandRecordsQuery,
  useCreateLandRecordMutation,
  useUpdateLandRecordMutation,
  useDeleteLandRecordMutation,
} = landApi;

export const { useGetProjectsQuery, useCreateProjectMutation } = projectApi;
export const {
  useGetPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = propertyApi;
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


