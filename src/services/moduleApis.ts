import { CRM_PIPELINE_STAGES } from "@/constants/app";
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
  mockLeases,
  mockProcurementOrders,
  mockProjects,
  mockProperties,
  mockTenants,
  mockUnits,
  mockVendors,
  mockWorkOrders,
  mockInvoices,
  mockTransactions,
  mockChartOfAccounts,
  mockDocuments,
} from "@/lib/mock-data";
import {
  getLocalStorageData,
  setLocalStorageData,
  syncLandRecordSubkeys,
  syncPropertyUnitSubkeys,
} from "@/lib/storage-utils";
import {
  generateEmployeeId,
  normalizeEmployee,
} from "@/lib/hr-utils";
import { delay } from "@/lib/utils";
import type {
  CreateBookingFormData,
  CreateCollectionFormData,
  CreateComplaintFormData,
  CreateContractorFormData,
  CreateEmployeeFormData,
  UpdateEmployeeFormData,
  CreateInventoryItemFormData,
  CreateJournalEntryFormData,
  CreateLandRecordFormData,
  CreateLeadFormData,
  CreateProcurementFormData,
  CreateProjectFormData,
  LeaseFormData,
  PropertyFormData,
  TenantFormData,
  UnitFormData,
  VendorFormData,
  WorkOrderFormData,
  CreateDocumentFormData,
} from "@/schemas";
import type { CreateCustomerFormData } from "@/schemas/customer";
import type {
  Booking,
  Collection,
  Customer,
  Document,
  Employee,
  LandRecord,
  Lead,
  Lease,
  PaginatedResponse,
  Project,
  Property,
  PropertyUnit,
  Tenant,
  Vendor,
  WorkOrder,
} from "@/types";
import { baseApi } from "./baseApi";

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
        return {
          data: getLocalStorageData<LandRecord>("landRecords", mockLandRecords),
        };
      },
      providesTags: ["Land"],
    }),

    createLandRecord: builder.mutation<LandRecord, CreateLandRecordFormData>({
      queryFn: async (data) => {
        await delay(400);
        const records = [
          ...getLocalStorageData<LandRecord>("landRecords", mockLandRecords),
        ];
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
        const records = [
          ...getLocalStorageData<LandRecord>("landRecords", mockLandRecords),
        ];
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
        const records = getLocalStorageData<LandRecord>(
          "landRecords",
          mockLandRecords,
        );
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
        const list = [
          ...getLocalStorageData<Project>("projects", mockProjects),
        ];
        const newProject: Project = {
          id: `proj_${Math.random().toString(36).slice(2, 10)}`,
          ...data,
          status: (data as any).status ?? "Planning",
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
        };
        (newProject as any).createdAt = new Date().toISOString();
        list.push(newProject);
        setLocalStorageData("projects", list);
        return { data: newProject };
      },
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<
      Project,
      { id: string; data: CreateProjectFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Project>("projects", mockProjects),
        ];
        const index = list.findIndex((project) => project.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Project not found" } };
        }
        const updatedProject: Project = {
          ...list[index],
          ...data,
          id,
          spent: data.actualCost ?? list[index].spent,
          completionPercent:
            data.completionPercent ?? list[index].completionPercent,
          projectType: data.projectType ?? list[index].projectType,
          landArea: data.landArea ?? list[index].landArea,
          availableUnits: data.availableUnits ?? list[index].availableUnits,
          soldUnits: data.soldUnits ?? list[index].soldUnits,
          reservedUnits: data.reservedUnits ?? list[index].reservedUnits,
          collectionAmount:
            data.collectionAmount ?? list[index].collectionAmount,
          dueAmount: data.dueAmount ?? list[index].dueAmount,
          expectedCompletion:
            data.expectedCompletion ?? list[index].expectedCompletion,
          projectManager: data.projectManager ?? list[index].projectManager,
        };
        list[index] = updatedProject;
        setLocalStorageData("projects", list);
        return { data: updatedProject };
      },
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Project>("projects", mockProjects),
        ];
        const filtered = list.filter((project) => project.id !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Project not found" } };
        }
        setLocalStorageData("projects", filtered);
        return { data: id };
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
        return {
          data: getLocalStorageData<Property>("properties", mockProperties),
        };
      },
      providesTags: ["Property"],
    }),
    createProperty: builder.mutation<Property, PropertyFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Property>("properties", mockProperties),
        ];
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
    updateProperty: builder.mutation<
      Property,
      { id: string; data: PropertyFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Property>("properties", mockProperties),
        ];
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
        const list = getLocalStorageData<Property>(
          "properties",
          mockProperties,
        );
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
        const properties = getLocalStorageData<Property>(
          "properties",
          mockProperties,
        );
        const matchedProperty = properties.find(
          (p) => p.name === data.propertyName,
        );
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
    updateUnit: builder.mutation<
      PropertyUnit,
      { id: string; data: UnitFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [...getLocalStorageData<PropertyUnit>("units", mockUnits)];
        const index = list.findIndex((u) => u.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Unit not found" } };
        }
        const properties = getLocalStorageData<Property>(
          "properties",
          mockProperties,
        );
        const matchedProperty = properties.find(
          (p) => p.name === data.propertyName,
        );
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

export const leaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeases: builder.query<Lease[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<Lease>("leases", mockLeases) };
      },
      providesTags: ["Lease"],
    }),
    createLease: builder.mutation<Lease, LeaseFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<Lease>("leases", mockLeases)];
        const seq = list.length + 1;
        const newLease: Lease = {
          id: `lease_${Math.random().toString(36).slice(2, 10)}`,
          leaseNumber: `LEASE-${String(seq).padStart(3, "0")}`,
          ...data,
        };
        list.push(newLease);
        setLocalStorageData("leases", list);
        return { data: newLease };
      },
      invalidatesTags: ["Lease"],
    }),
    updateLease: builder.mutation<Lease, { id: string; data: LeaseFormData }>({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [...getLocalStorageData<Lease>("leases", mockLeases)];
        const index = list.findIndex((l) => l.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Lease not found" } };
        }
        const updated: Lease = {
          ...list[index],
          ...data,
          id,
          leaseNumber: list[index].leaseNumber,
        };
        list[index] = updated;
        setLocalStorageData("leases", list);
        return { data: updated };
      },
      invalidatesTags: ["Lease"],
    }),
    deleteLease: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<Lease>("leases", mockLeases);
        const filtered = list.filter((l) => l.id !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Lease not found" } };
        }
        setLocalStorageData("leases", filtered);
        return { data: id };
      },
      invalidatesTags: ["Lease"],
    }),
  }),
});

export const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTenants: builder.query<Tenant[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getLocalStorageData<Tenant>("tenants", mockTenants) };
      },
      providesTags: ["Tenant"],
    }),
    createTenant: builder.mutation<Tenant, TenantFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<Tenant>("tenants", mockTenants)];
        const newTenant: Tenant = {
          id: `tenant_${Math.random().toString(36).slice(2, 10)}`,
          ...data,
        };
        list.push(newTenant);
        setLocalStorageData("tenants", list);
        return { data: newTenant };
      },
      invalidatesTags: ["Tenant"],
    }),
    updateTenant: builder.mutation<
      Tenant,
      { id: string; data: TenantFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [...getLocalStorageData<Tenant>("tenants", mockTenants)];
        const index = list.findIndex((t) => t.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Tenant not found" } };
        }
        const updated: Tenant = { ...list[index], ...data, id };
        list[index] = updated;
        setLocalStorageData("tenants", list);
        return { data: updated };
      },
      invalidatesTags: ["Tenant"],
    }),
    deleteTenant: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<Tenant>("tenants", mockTenants);
        const filtered = list.filter((t) => t.id !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Tenant not found" } };
        }
        setLocalStorageData("tenants", filtered);
        return { data: id };
      },
      invalidatesTags: ["Tenant"],
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
        const leads = getLocalStorageData<Lead>("leads", mockLeads).map(
          (l) => ({ ...l }),
        );
        const lead = leads.find((l) => l.id === id);
        if (!lead) {
          return {
            error: { status: 404, data: { message: "Lead not found" } },
          };
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
          createdAt: new Date().toISOString().slice(0, 10),
          ...data,
        };
        list.push(newLead);
        setLocalStorageData("leads", list);
        return { data: newLead };
      },
      invalidatesTags: ["CRM"],
    }),
    updateLead: builder.mutation<
      Lead,
      { id: string; data: CreateLeadFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [...getLocalStorageData<Lead>("leads", mockLeads)];
        const index = list.findIndex((lead) => lead.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Lead not found" } };
        }
        const updatedLead: Lead = {
          ...list[index],
          ...data,
          id,
        };
        list[index] = updatedLead;
        setLocalStorageData("leads", list);
        return { data: updatedLead };
      },
      invalidatesTags: ["CRM"],
    }),
    deleteLead: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = [...getLocalStorageData<Lead>("leads", mockLeads)];
        const filtered = list.filter((lead) => lead.id !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Lead not found" } };
        }
        setLocalStorageData("leads", filtered);
        return { data: id };
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
        const list = [
          ...getLocalStorageData<Booking>("bookings", mockBookings),
        ];
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
        return {
          data: getLocalStorageData<Collection>("collections", mockCollections),
        };
      },
      providesTags: ["Collection"],
    }),
    createCollection: builder.mutation<Collection, CreateCollectionFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Collection>("collections", mockCollections),
        ];
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
        return {
          data: getLocalStorageData<Customer>("customers", mockCustomers),
        };
      },
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation<Customer, CreateCustomerFormData>({
      queryFn: async (customer) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Customer>("customers", mockCustomers),
        ];
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
        return {
          data: getLocalStorageData<any>("vendors", mockProcurementOrders),
        };
      },
      providesTags: ["Procurement"],
    }),
    createOrder: builder.mutation<any, CreateProcurementFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<any>("vendors", mockProcurementOrders),
        ];
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

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<Vendor[], void>({
      queryFn: async () => {
        await delay(400);
        return {
          data: getLocalStorageData<Vendor>("vendorContacts", mockVendors),
        };
      },
      providesTags: ["Vendor"],
    }),
    createVendor: builder.mutation<Vendor, VendorFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Vendor>("vendorContacts", mockVendors),
        ];
        const newVendor: Vendor = {
          id: `ven_${Math.random().toString(36).slice(2, 10)}`,
          ...data,
        };
        list.push(newVendor);
        setLocalStorageData("vendorContacts", list);
        return { data: newVendor };
      },
      invalidatesTags: ["Vendor"],
    }),
    updateVendor: builder.mutation<
      Vendor,
      { id: string; data: VendorFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Vendor>("vendorContacts", mockVendors),
        ];
        const index = list.findIndex((vendor) => vendor.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Vendor not found" } };
        }
        const updated: Vendor = { ...list[index], ...data, id };
        list[index] = updated;
        setLocalStorageData("vendorContacts", list);
        return { data: updated };
      },
      invalidatesTags: ["Vendor"],
    }),
    deleteVendor: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Vendor>("vendorContacts", mockVendors),
        ];
        const updatedList = list.filter((vendor) => vendor.id !== id);
        setLocalStorageData("vendorContacts", updatedList);
        return { data: id };
      },
      invalidatesTags: ["Vendor"],
    }),
  }),
});

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<any[], void>({
      queryFn: async () => {
        await delay(400);
        return {
          data: getLocalStorageData<any>("inventory", mockInventoryItems),
        };
      },
      providesTags: ["Inventory"],
    }),
    createItem: builder.mutation<any, CreateInventoryItemFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<any>("inventory", mockInventoryItems),
        ];
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
        return {
          data: getLocalStorageData<any>("contractors", mockContractors),
        };
      },
      providesTags: ["Contractor"],
    }),
    createContractor: builder.mutation<any, CreateContractorFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<any>("contractors", mockContractors),
        ];
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
    // Accounts (legacy)
    getAccounts: builder.query<any[], void>({
      queryFn: async () => {
        await delay(400);
        return {
          data: getLocalStorageData<any>("accounts", mockFinanceAccounts),
        };
      },
      providesTags: ["Finance"],
    }),
    createJournalEntry: builder.mutation<any, any>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<any>("accounts", mockFinanceAccounts),
        ];
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

    // Invoices
    getInvoices: builder.query<any[], void>({
      queryFn: async () => {
        await delay(300);
        return { data: getLocalStorageData<any>("invoices", mockInvoices) };
      },
      providesTags: ["Finance"],
    }),
    createInvoice: builder.mutation<any, any>({
      queryFn: async (data) => {
        await delay(400);
        const list = [...getLocalStorageData<any>("invoices", mockInvoices)];
        const seq = list.length + 1;
        const newInvoice = {
          id: `inv_${Math.random().toString(36).slice(2, 10)}`,
          invoiceNo: `INV-2026-${String(seq).padStart(3, "0")}`,
          status: "unpaid",
          ...data,
        };
        list.push(newInvoice);
        setLocalStorageData("invoices", list);
        return { data: newInvoice };
      },
      invalidatesTags: ["Finance"],
    }),
    updateInvoice: builder.mutation<any, { id: string; data: any }>({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [...getLocalStorageData<any>("invoices", mockInvoices)];
        const index = list.findIndex((i) => i.id === id);
        if (index === -1)
          return { error: { status: 404, data: "Invoice not found" } };
        list[index] = { ...list[index], ...data, id };
        setLocalStorageData("invoices", list);
        return { data: list[index] };
      },
      invalidatesTags: ["Finance"],
    }),
    deleteInvoice: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<any>("invoices", mockInvoices);
        const filtered = list.filter((i: any) => i.id !== id);
        setLocalStorageData("invoices", filtered);
        return { data: id };
      },
      invalidatesTags: ["Finance"],
    }),

    // Transactions
    getTransactions: builder.query<any[], void>({
      queryFn: async () => {
        await delay(300);
        return {
          data: getLocalStorageData<any>("transactions", mockTransactions),
        };
      },
      providesTags: ["Finance"],
    }),
    createTransaction: builder.mutation<any, any>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<any>("transactions", mockTransactions),
        ];
        const seq = list.length + 1;
        const newTxn = {
          id: `txn_${Math.random().toString(36).slice(2, 10)}`,
          txnNo: `TXN-${String(seq).padStart(3, "0")}`,
          status: "cleared",
          ...data,
        };
        list.push(newTxn);
        setLocalStorageData("transactions", list);
        return { data: newTxn };
      },
      invalidatesTags: ["Finance"],
    }),
    updateTransaction: builder.mutation<any, { id: string; data: any }>({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<any>("transactions", mockTransactions),
        ];
        const index = list.findIndex((t) => t.id === id);
        if (index === -1)
          return { error: { status: 404, data: "Transaction not found" } };
        list[index] = { ...list[index], ...data, id };
        setLocalStorageData("transactions", list);
        return { data: list[index] };
      },
      invalidatesTags: ["Finance"],
    }),
    deleteTransaction: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<any>("transactions", mockTransactions);
        const filtered = list.filter((t: any) => t.id !== id);
        setLocalStorageData("transactions", filtered);
        return { data: id };
      },
      invalidatesTags: ["Finance"],
    }),

    // Chart of Accounts
    getChartOfAccounts: builder.query<any[], void>({
      queryFn: async () => {
        await delay(300);
        return {
          data: getLocalStorageData<any>(
            "chartOfAccounts",
            mockChartOfAccounts,
          ),
        };
      },
      providesTags: ["Finance"],
    }),
    createChartAccount: builder.mutation<any, any>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<any>("chartOfAccounts", mockChartOfAccounts),
        ];
        const newAccount = {
          id: `coa_${Math.random().toString(36).slice(2, 10)}`,
          active: true,
          ...data,
        };
        list.push(newAccount);
        setLocalStorageData("chartOfAccounts", list);
        return { data: newAccount };
      },
      invalidatesTags: ["Finance"],
    }),
    updateChartAccount: builder.mutation<any, { id: string; data: any }>({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<any>("chartOfAccounts", mockChartOfAccounts),
        ];
        const index = list.findIndex((a) => a.id === id);
        if (index === -1)
          return { error: { status: 404, data: "Account not found" } };
        list[index] = { ...list[index], ...data, id };
        setLocalStorageData("chartOfAccounts", list);
        return { data: list[index] };
      },
      invalidatesTags: ["Finance"],
    }),
    deleteChartAccount: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<any>(
          "chartOfAccounts",
          mockChartOfAccounts,
        );
        const filtered = list.filter((a: any) => a.id !== id);
        setLocalStorageData("chartOfAccounts", filtered);
        return { data: id };
      },
      invalidatesTags: ["Finance"],
    }),
  }),
});

export const hrApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<Employee[], void>({
      queryFn: async () => {
        await delay(400);
        const raw = getLocalStorageData<Record<string, unknown>>(
          "employees",
          mockEmployees,
        );
        return { data: raw.map((item) => normalizeEmployee(item)) };
      },
      providesTags: ["HR"],
    }),
    getEmployeeById: builder.query<Employee, string>({
      queryFn: async (id) => {
        await delay(300);
        const raw = getLocalStorageData<Record<string, unknown>>(
          "employees",
          mockEmployees,
        );
        const found = raw.find((item) => String(item.id) === id);
        if (!found) {
          return { error: { status: 404, data: "Employee not found" } };
        }
        return { data: normalizeEmployee(found) };
      },
      providesTags: (_result, _error, id) => [{ type: "HR", id }],
    }),
    createEmployee: builder.mutation<Employee, CreateEmployeeFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = getLocalStorageData<Record<string, unknown>>(
          "employees",
          mockEmployees,
        );
        const employees = list.map((item) => normalizeEmployee(item));

        if (
          data.nidNumber &&
          employees.some((e) => e.nidNumber === data.nidNumber)
        ) {
          return {
            error: { status: 400, data: "NID number already exists" },
          };
        }

        const now = new Date().toISOString();
        const employeeId = generateEmployeeId(employees);
        const parsedSalary =
          data.salary && data.salary.trim() !== ""
            ? Number(data.salary)
            : undefined;
        if (parsedSalary !== undefined && Number.isNaN(parsedSalary)) {
          return {
            error: { status: 400, data: "Salary must be numeric" },
          };
        }
        if (parsedSalary !== undefined && parsedSalary <= 0) {
          return {
            error: { status: 400, data: "Salary must be positive" },
          };
        }
        const newEmployee: Employee = {
          id: `emp_${Math.random().toString(36).slice(2, 10)}`,
          employeeId,
          fullName: data.fullName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          nidNumber: data.nidNumber || undefined,
          mobileNumber: data.mobileNumber,
          email: data.email || undefined,
          presentAddress: data.presentAddress || undefined,
          permanentAddress: data.permanentAddress || undefined,
          department: data.department,
          designation: data.designation,
          employmentType: data.employmentType,
          joiningDate: data.joiningDate,
          reportingManagerId: data.reportingManagerId || undefined,
          salary: parsedSalary,
          bankName: data.bankName || undefined,
          bankAccountNumber: data.bankAccountNumber || undefined,
          employeeStatus: data.employeeStatus,
          fatherName: data.fatherName || undefined,
          motherName: data.motherName || undefined,
          spouseName: data.spouseName || undefined,
          emergencyContactName: data.emergencyContactName,
          emergencyContactRelationship: data.emergencyContactRelationship,
          emergencyContactNumber: data.emergencyContactNumber,
          createdAt: now,
          updatedAt: now,
        };

        list.push(newEmployee);
        setLocalStorageData("employees", list);
        return { data: newEmployee };
      },
      invalidatesTags: ["HR"],
    }),
    updateEmployee: builder.mutation<
      Employee,
      { id: string; data: UpdateEmployeeFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = getLocalStorageData<Record<string, unknown>>(
          "employees",
          mockEmployees,
        );
        const index = list.findIndex((item) => String(item.id) === id);
        if (index === -1) {
          return { error: { status: 404, data: "Employee not found" } };
        }

        const employees = list.map((item) => normalizeEmployee(item));
        if (
          data.nidNumber &&
          employees.some(
            (e) => e.id !== id && e.nidNumber === data.nidNumber,
          )
        ) {
          return {
            error: { status: 400, data: "NID number already exists" },
          };
        }

        const existing = normalizeEmployee(list[index]);
        const parsedSalary =
          data.salary && data.salary.trim() !== ""
            ? Number(data.salary)
            : undefined;
        if (parsedSalary !== undefined && Number.isNaN(parsedSalary)) {
          return {
            error: { status: 400, data: "Salary must be numeric" },
          };
        }
        if (parsedSalary !== undefined && parsedSalary <= 0) {
          return {
            error: { status: 400, data: "Salary must be positive" },
          };
        }
        const updated: Employee = {
          ...existing,
          fullName: data.fullName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          nidNumber: data.nidNumber || undefined,
          mobileNumber: data.mobileNumber,
          email: data.email || undefined,
          presentAddress: data.presentAddress || undefined,
          permanentAddress: data.permanentAddress || undefined,
          department: data.department,
          designation: data.designation,
          employmentType: data.employmentType,
          joiningDate: data.joiningDate,
          reportingManagerId: data.reportingManagerId || undefined,
          salary: parsedSalary,
          bankName: data.bankName || undefined,
          bankAccountNumber: data.bankAccountNumber || undefined,
          employeeStatus: data.employeeStatus,
          fatherName: data.fatherName || undefined,
          motherName: data.motherName || undefined,
          spouseName: data.spouseName || undefined,
          emergencyContactName: data.emergencyContactName,
          emergencyContactRelationship: data.emergencyContactRelationship,
          emergencyContactNumber: data.emergencyContactNumber,
          updatedAt: new Date().toISOString(),
        };

        list[index] = updated;
        setLocalStorageData("employees", list);
        return { data: updated };
      },
      invalidatesTags: ["HR"],
    }),
    deleteEmployee: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<Record<string, unknown>>(
          "employees",
          mockEmployees,
        );
        const filtered = list.filter((item) => String(item.id) !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Employee not found" } };
        }
        setLocalStorageData("employees", filtered);
        return { data: id };
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
        const list = [
          ...getLocalStorageData<any>("complaints", mockComplaints),
        ];
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

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;
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
  useGetLeasesQuery,
  useCreateLeaseMutation,
  useUpdateLeaseMutation,
  useDeleteLeaseMutation,
} = leaseApi;
export const {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} = tenantApi;
export const {
  useGetLeadsQuery,
  useGetPipelineQuery,
  useUpdateLeadStageMutation,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
} = crmApi;
export const { useGetBookingsQuery, useCreateBookingMutation } = bookingApi;
export const { useGetCollectionsQuery, useCreateCollectionMutation } =
  collectionApi;
export const { useGetCustomersQuery, useCreateCustomerMutation } = customerApi;
export const { useGetProgressQuery } = constructionApi;
export const { useGetOrdersQuery, useCreateOrderMutation } = procurementApi;
export const {
  useGetVendorsQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApi;
export const { useGetItemsQuery, useCreateItemMutation } = inventoryApi;
export const { useGetContractorsQuery, useCreateContractorMutation } =
  contractorApi;
export const {
  useGetAccountsQuery,
  useCreateJournalEntryMutation,
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useGetChartOfAccountsQuery,
  useCreateChartAccountMutation,
  useUpdateChartAccountMutation,
  useDeleteChartAccountMutation,
} = financeApi;
export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = hrApi;
export const { useGetComplaintsQuery, useCreateComplaintMutation } =
  maintenanceApi;
export const { useGetSalesReportQuery } = reportApi;

export const workOrderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkOrders: builder.query<WorkOrder[], void>({
      queryFn: async () => {
        await delay(400);
        return {
          data: getLocalStorageData<WorkOrder>("workOrders", mockWorkOrders),
        };
      },
      providesTags: ["Maintenance"],
    }),
    createWorkOrder: builder.mutation<WorkOrder, WorkOrderFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<WorkOrder>("workOrders", mockWorkOrders),
        ];
        const seq = list.length + 1;
        const newOrder: WorkOrder = {
          id: `wo_${Math.random().toString(36).slice(2, 10)}`,
          woNumber: `WO-${String(seq).padStart(3, "0")}`,
          ...data,
        };
        list.push(newOrder);
        setLocalStorageData("workOrders", list);
        return { data: newOrder };
      },
      invalidatesTags: ["Maintenance"],
    }),
    updateWorkOrder: builder.mutation<
      WorkOrder,
      { id: string; data: WorkOrderFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<WorkOrder>("workOrders", mockWorkOrders),
        ];
        const index = list.findIndex((w) => w.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Work order not found" } };
        }
        const updated: WorkOrder = {
          ...list[index],
          ...data,
          id,
        };
        list[index] = updated;
        setLocalStorageData("workOrders", list);
        return { data: updated };
      },
      invalidatesTags: ["Maintenance"],
    }),
    deleteWorkOrder: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = getLocalStorageData<WorkOrder>(
          "workOrders",
          mockWorkOrders,
        );
        const filtered = list.filter((w) => w.id !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Work order not found" } };
        }
        setLocalStorageData("workOrders", filtered);
        return { data: id };
      },
      invalidatesTags: ["Maintenance"],
    }),
  }),
});

export const {
  useGetWorkOrdersQuery,
  useCreateWorkOrderMutation,
  useUpdateWorkOrderMutation,
  useDeleteWorkOrderMutation,
} = workOrderApi;

export const documentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<Document[], void>({
      queryFn: async () => {
        await delay(400);
        return {
          data: getLocalStorageData<Document>("documents", mockDocuments),
        };
      },
      providesTags: ["Document"],
    }),
    createDocument: builder.mutation<Document, CreateDocumentFormData>({
      queryFn: async (data) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Document>("documents", mockDocuments),
        ];
        const newDoc: Document = {
          id: `doc_${Math.random().toString(36).slice(2, 10)}`,
          ...data,
          createdAt: new Date().toISOString(),
        };
        list.push(newDoc);
        setLocalStorageData("documents", list);
        return { data: newDoc };
      },
      invalidatesTags: ["Document"],
    }),
    updateDocument: builder.mutation<
      Document,
      { id: string; data: CreateDocumentFormData }
    >({
      queryFn: async ({ id, data }) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Document>("documents", mockDocuments),
        ];
        const index = list.findIndex((doc) => doc.id === id);
        if (index === -1) {
          return { error: { status: 404, data: "Document not found" } };
        }
        const updatedDoc: Document = {
          ...list[index],
          ...data,
          id,
        };
        list[index] = updatedDoc;
        setLocalStorageData("documents", list);
        return { data: updatedDoc };
      },
      invalidatesTags: ["Document"],
    }),
    deleteDocument: builder.mutation<string, string>({
      queryFn: async (id) => {
        await delay(400);
        const list = [
          ...getLocalStorageData<Document>("documents", mockDocuments),
        ];
        const filtered = list.filter((doc) => doc.id !== id);
        if (filtered.length === list.length) {
          return { error: { status: 404, data: "Document not found" } };
        }
        setLocalStorageData("documents", filtered);
        return { data: id };
      },
      invalidatesTags: ["Document"],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = documentApi;
