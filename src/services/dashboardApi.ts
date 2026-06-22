import { baseApi } from "./baseApi";
import { delay } from "@/lib/utils";
import {
  mockActivities,
  mockBookings,
  mockCashFlow,
  mockCollectionTrend,
  mockCollections,
  mockKpis,
  mockLeadConversion,
  mockNotifications,
  mockSalesTrend,
  mockTasks,
  mockUnitStatus,
} from "@/lib/mock-data";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKpis: builder.query<typeof mockKpis, void>({
      queryFn: async () => {
        await delay(400);
        return { data: mockKpis };
      },
      providesTags: ["Dashboard"],
    }),
    getSalesTrend: builder.query<typeof mockSalesTrend, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockSalesTrend };
      },
      providesTags: ["Dashboard"],
    }),
    getCollectionTrend: builder.query<typeof mockCollectionTrend, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockCollectionTrend };
      },
      providesTags: ["Dashboard"],
    }),
    getLeadConversion: builder.query<typeof mockLeadConversion, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockLeadConversion };
      },
      providesTags: ["Dashboard"],
    }),
    getUnitStatus: builder.query<typeof mockUnitStatus, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockUnitStatus };
      },
      providesTags: ["Dashboard"],
    }),
    getCashFlow: builder.query<typeof mockCashFlow, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockCashFlow };
      },
      providesTags: ["Dashboard"],
    }),
    getRecentBookings: builder.query<typeof mockBookings, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockBookings };
      },
      providesTags: ["Dashboard", "Booking"],
    }),
    getRecentCollections: builder.query<typeof mockCollections, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockCollections };
      },
      providesTags: ["Dashboard", "Collection"],
    }),
    getRecentActivities: builder.query<typeof mockActivities, void>({
      queryFn: async () => {
        await delay(300);
        return { data: mockActivities };
      },
      providesTags: ["Dashboard"],
    }),
    getNotifications: builder.query<typeof mockNotifications, void>({
      queryFn: async () => {
        await delay(200);
        return { data: mockNotifications };
      },
      providesTags: ["Notification"],
    }),
    getTasks: builder.query<typeof mockTasks, void>({
      queryFn: async () => {
        await delay(200);
        return { data: mockTasks };
      },
      providesTags: ["Task"],
    }),
  }),
});

export const {
  useGetKpisQuery,
  useGetSalesTrendQuery,
  useGetCollectionTrendQuery,
  useGetLeadConversionQuery,
  useGetUnitStatusQuery,
  useGetCashFlowQuery,
  useGetRecentBookingsQuery,
  useGetRecentCollectionsQuery,
  useGetRecentActivitiesQuery,
  useGetNotificationsQuery,
  useGetTasksQuery,
} = dashboardApi;
