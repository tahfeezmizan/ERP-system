import { baseApi } from "./baseApi";
import { delay, formatBDT } from "@/lib/utils";
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
  mockUnits,
  mockLeads,
} from "@/lib/mock-data";
import { getLocalStorageData } from "@/lib/storage-utils";
import type { Booking, Collection, KpiMetric } from "@/types";

function getDynamicKpis(): KpiMetric[] {
  // Create a deep copy of the static kpi configurations
  const kpis = mockKpis.map((k) => ({ ...k }));
  const units = getLocalStorageData("units", mockUnits);
  const leads = getLocalStorageData("leads", mockLeads);
  const bookings = getLocalStorageData("bookings", mockBookings);
  const collections = getLocalStorageData("collections", mockCollections);

  // Available Units
  const availableCount = units.filter((u: any) => u.status === "vacant").length;
  const kpi4 = kpis.find((k) => k.id === "4");
  if (kpi4) kpi4.value = availableCount;

  // Booked Units
  const bookedCount = units.filter((u: any) => u.status === "occupied").length;
  const kpi5 = kpis.find((k) => k.id === "5");
  if (kpi5) kpi5.value = bookedCount;

  // Sold Units
  const soldCount = units.length;
  const kpi6 = kpis.find((k) => k.id === "6");
  if (kpi6) kpi6.value = soldCount;

  // Active Leads
  const kpi11 = kpis.find((k) => k.id === "11");
  if (kpi11) kpi11.value = leads.length;

  // Pending Approvals
  const pendingCount = bookings.filter((b: any) => b.status === "Pending").length;
  const kpi12 = kpis.find((k) => k.id === "12");
  if (kpi12) kpi12.value = pendingCount;

  // Monthly Sales
  const totalSales = bookings.reduce((sum: number, b: any) => sum + (Number(b.totalPrice) || 0), 0);
  const kpi3 = kpis.find((k) => k.id === "3");
  if (kpi3) kpi3.value = formatBDT(totalSales || 38000000);

  // Monthly Collection
  const totalCollections = collections.reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
  const kpi2 = kpis.find((k) => k.id === "2");
  if (kpi2) kpi2.value = formatBDT(totalCollections || 24500000);

  // Today's Collection
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayCollections = collections
    .filter((c: any) => c.paymentDate === todayStr)
    .reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
  const kpi1 = kpis.find((k) => k.id === "1");
  if (kpi1) kpi1.value = todayCollections > 0 ? formatBDT(todayCollections) : formatBDT(1250000);

  return kpis;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getKpis: builder.query<KpiMetric[], void>({
      queryFn: async () => {
        await delay(400);
        return { data: getDynamicKpis() };
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
    getLeadConversion: builder.query<any[], void>({
      queryFn: async () => {
        await delay(300);
        const leads = getLocalStorageData("leads", mockLeads);
        const stages = ["Lead", "Interested", "Site Visit", "Negotiation", "Booking", "Agreement", "Registration", "Handover"];
        const conversion = stages.map((stage) => ({
          name: stage,
          value: leads.filter((l: any) => l.stage === stage).length,
        }));
        return { data: conversion };
      },
      providesTags: ["Dashboard"],
    }),
    getUnitStatus: builder.query<any[], void>({
      queryFn: async () => {
        await delay(300);
        const units = getLocalStorageData("units", mockUnits);
        const statuses = ["occupied", "vacant"];
        const distribution = statuses.map((status) => ({
          name: status,
          value: units.filter((u: any) => u.status === status).length,
        }));
        return { data: distribution };
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
    getRecentBookings: builder.query<Booking[], void>({
      queryFn: async () => {
        await delay(300);
        const bookings = getLocalStorageData<Booking>("bookings", mockBookings);
        return { data: bookings.slice(-5).reverse() };
      },
      providesTags: ["Dashboard", "Booking"],
    }),
    getRecentCollections: builder.query<Collection[], void>({
      queryFn: async () => {
        await delay(300);
        const collections = getLocalStorageData<Collection>("collections", mockCollections);
        return { data: collections.slice(-5).reverse() };
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

