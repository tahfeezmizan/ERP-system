"use client";

import {
  Activity,
  Banknote,
  Building,
  CalendarCheck,
  ClipboardCheck,
  DollarSign,
  HardHat,
  Home,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/shared/KpiCard";
import { ChartCard } from "@/components/charts/ChartCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { ActivityTimeline } from "@/components/shared/ActivityTimeline";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetCashFlowQuery,
  useGetCollectionTrendQuery,
  useGetKpisQuery,
  useGetLeadConversionQuery,
  useGetRecentActivitiesQuery,
  useGetRecentBookingsQuery,
  useGetRecentCollectionsQuery,
  useGetSalesTrendQuery,
  useGetUnitStatusQuery,
} from "@/services/dashboardApi";
import { formatBDT } from "@/lib/utils";
import type { KpiMetric } from "@/types";

const KPI_ICONS: Record<string, LucideIcon> = {
  "1": Banknote,
  "2": Wallet,
  "3": TrendingUp,
  "4": Home,
  "5": CalendarCheck,
  "6": Building,
  "7": DollarSign,
  "8": Banknote,
  "9": HardHat,
  "10": CalendarCheck,
  "11": Users,
  "12": ClipboardCheck,
};

const PIE_COLORS = ["#1D4ED8", "#3B82F6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function DashboardPage() {
  const { data: kpis = [], isLoading: kpisLoading } = useGetKpisQuery();
  const { data: salesTrend = [], isLoading: salesLoading } = useGetSalesTrendQuery();
  const { data: collectionTrend = [], isLoading: collectionLoading } = useGetCollectionTrendQuery();
  const { data: leadConversion = [], isLoading: leadLoading } = useGetLeadConversionQuery();
  const { data: unitStatus = [], isLoading: unitLoading } = useGetUnitStatusQuery();
  const { data: cashFlow = [], isLoading: cashFlowLoading } = useGetCashFlowQuery();
  const { data: recentBookings = [] } = useGetRecentBookingsQuery();
  const { data: recentCollections = [] } = useGetRecentCollectionsQuery();
  const { data: activities = [] } = useGetRecentActivitiesQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        description="Real-time overview of your real estate business"
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {kpisLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
            ))
          : kpis.map((kpi: KpiMetric) => (
              <KpiCard
                key={kpi.id}
                metric={kpi}
                icon={KPI_ICONS[kpi.id] ?? Activity}
              />
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Sales Trend" isLoading={salesLoading}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => formatBDT(Number(v))} />
              <Area type="monotone" dataKey="sales" stroke="#1D4ED8" fill="#1D4ED8" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Collection Trend" isLoading={collectionLoading}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={collectionTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => formatBDT(Number(v))} />
              <Line type="monotone" dataKey="collection" stroke="#22C55E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Lead Conversion Funnel" isLoading={leadLoading}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leadConversion} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={90} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Unit Status Distribution" isLoading={unitLoading}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={unitStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {unitStatus.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cash Flow" isLoading={cashFlowLoading} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cashFlow}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v) => formatBDT(Number(v))} />
              <Legend />
              <Bar dataKey="inflow" fill="#22C55E" name="Inflow" />
              <Bar dataKey="outflow" fill="#EF4444" name="Outflow" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{b.bookingNo}</p>
                  <p className="text-muted-foreground">{b.customerName}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Collections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCollections.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{c.receiptNo}</p>
                  <p className="text-muted-foreground">{c.customerName}</p>
                </div>
                <span className="font-medium text-success">{formatBDT(c.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
