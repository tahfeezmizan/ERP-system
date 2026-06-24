"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// Tab types
type TabCategory = "Occupancy" | "Financial" | "Leases" | "Work Orders";

// ─── OCCUPANCY DATA ───────────────────────────────────────────────────────────
const occupancyByPropertyData = [
  { name: "Grand Plaza Cor...", Occupied: 2, Vacant: 2 },
  { name: "Oakridge Reside...", Occupied: 2, Vacant: 2 },
  { name: "Skyline Industr...", Occupied: 1, Vacant: 1 },
];

const unitStatusData = [
  { name: "Occupied", value: 5, color: "#2563EB" }, // Blue
  { name: "Vacant", value: 5, color: "#10B981" }, // Emerald
];

const occupancyTrendData = [
  { month: "Jan", Rate: 75 },
  { month: "Feb", Rate: 75 },
  { month: "Mar", Rate: 80 },
  { month: "Apr", Rate: 80 },
  { month: "May", Rate: 60 },
];

const unitTypesData = [
  { name: "Office", value: 4, color: "#2563EB" },
  { name: "Apartment", value: 4, color: "#10B981" },
  { name: "Warehouse", value: 2, color: "#F59E0B" }, // Amber
];

const propertyOccupancyDetails = [
  {
    property: "Grand Plaza Corporate Center",
    total: 4,
    occupied: 2,
    vacant: 2,
    rate: 50,
  },
  {
    property: "Oakridge Residential Towers",
    total: 4,
    occupied: 2,
    vacant: 2,
    rate: 50,
  },
  {
    property: "Skyline Industrial Park",
    total: 2,
    occupied: 1,
    vacant: 1,
    rate: 50,
  },
];

// ─── FINANCIAL DATA ───────────────────────────────────────────────────────────
const financialTrendData = [
  { month: "Jan", Revenue: 42000, Expenses: 14000 },
  { month: "Feb", Revenue: 45000, Expenses: 15000 },
  { month: "Mar", Revenue: 48000, Expenses: 16000 },
  { month: "Apr", Revenue: 44000, Expenses: 15000 },
  { month: "May", Revenue: 52000, Expenses: 18000 },
];

const revenueBreakdownData = [
  { name: "Commercial Rent", value: 23000, color: "#2563EB" },
  { name: "Residential Rent", value: 15000, color: "#10B981" },
  { name: "Parking Fees", value: 5000, color: "#F59E0B" },
  { name: "Service Charges", value: 9000, color: "#8B5CF6" }, // Purple
];

const recentTransactions = [
  {
    id: "TX-101",
    tenant: "TechStart Inc",
    property: "Grand Plaza",
    amount: 11000,
    date: "2026-06-01",
    status: "Paid",
  },
  {
    id: "TX-102",
    tenant: "Acme Corporation",
    property: "Grand Plaza",
    amount: 12000,
    date: "2026-06-01",
    status: "Paid",
  },
  {
    id: "TX-103",
    tenant: "Jane Miller",
    property: "Oakridge Towers",
    amount: 2500,
    date: "2026-06-01",
    status: "Paid",
  },
  {
    id: "TX-104",
    tenant: "John Doe",
    property: "Oakridge Towers",
    amount: 2500,
    date: "2026-05-28",
    status: "Overdue",
  },
];

// ─── LEASES DATA ──────────────────────────────────────────────────────────────
const leaseStatusData = [
  { name: "Active", value: 4, color: "#10B981" },
  { name: "Expiring", value: 2, color: "#F59E0B" },
  { name: "Expired", value: 1, color: "#EF4444" }, // Red
];

const leaseSigningsData = [
  { month: "Jan", Signings: 1 },
  { month: "Feb", Signings: 2 },
  { month: "Mar", Signings: 0 },
  { month: "Apr", Signings: 3 },
  { month: "May", Signings: 1 },
];

const expiringLeases = [
  {
    id: "L-01",
    tenant: "TechStart Inc",
    unit: "Suite 201",
    expiry: "2026-06-30",
    daysLeft: 6,
  },
  {
    id: "L-02",
    tenant: "Jane Miller",
    unit: "Unit B-1",
    expiry: "2026-06-15",
    daysLeft: -9,
  }, // Overdue
  {
    id: "L-03",
    tenant: "John Doe",
    unit: "Unit A-1",
    expiry: "2026-06-30",
    daysLeft: 6,
  },
];

// ─── WORK ORDERS DATA ─────────────────────────────────────────────────────────
const workOrderStatusData = [
  { name: "Completed", value: 2, color: "#10B981" },
  { name: "In Progress", value: 1, color: "#2563EB" },
  { name: "Scheduled", value: 1, color: "#F59E0B" },
  { name: "Open", value: 1, color: "#EF4444" },
];

const workOrdersByCategory = [
  { name: "Plumbing", Orders: 2 },
  { name: "Electrical", Orders: 1 },
  { name: "Elevator", Orders: 1 },
  { name: "HVAC", Orders: 1 },
];

const activeWorkOrders = [
  {
    id: "WO-01",
    title: "Leaking Faucet in A-1",
    property: "Oakridge Towers",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "WO-02",
    title: "Elevator Inspection",
    property: "Grand Plaza",
    priority: "Medium",
    status: "Scheduled",
  },
  {
    id: "WO-03",
    title: "lobby Light Bulbs Replacement",
    property: "Oakridge Towers",
    priority: "Low",
    status: "Open",
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabCategory>("Occupancy");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleExportPDF = () => {
    toast.info(`Generating PDF report for ${activeTab}...`);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive portfolio performance insights"
      >
        <Button
          variant="outline"
          onClick={handleExportPDF}
          className="rounded-lg border-zinc-200 bg-white shadow-sm font-medium flex items-center gap-1.5 px-4 py-2 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
        >
          <Download className="h-4 w-4" /> Export PDF
        </Button>
      </PageHeader>

      {/* Category Tabs Bar */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/40 w-fit">
        <button
          onClick={() => setActiveTab("Occupancy")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "Occupancy"
              ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Building2 className="h-4 w-4" /> Occupancy
        </button>
        <button
          onClick={() => setActiveTab("Financial")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "Financial"
              ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <DollarSign className="h-4 w-4" /> Financial
        </button>
        <button
          onClick={() => setActiveTab("Leases")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "Leases"
              ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <FileText className="h-4 w-4" /> Leases
        </button>
        <button
          onClick={() => setActiveTab("Work Orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "Work Orders"
              ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Wrench className="h-4 w-4" /> Work Orders
        </button>
      </div>

      {/* ─── TAB 1: OCCUPANCY REPORT ─────────────────────────────────────────── */}
      {activeTab === "Occupancy" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Properties
                  </p>
                  <p className="text-3xl font-bold tracking-tight">3</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <Building2 className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Units
                  </p>
                  <p className="text-3xl font-bold tracking-tight">10</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <Briefcase className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Occupied
                  </p>
                  <p className="text-3xl font-bold tracking-tight">5</p>
                  <p className="text-xs text-muted-foreground">
                    50% occupancy rate
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Vacant
                  </p>
                  <p className="text-3xl font-bold tracking-tight">5</p>
                  <p className="text-xs text-muted-foreground">
                    Available for lease
                  </p>
                </div>
                <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Occupancy Rate Banner */}
          <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-base">
                  Portfolio Occupancy Rate
                </h3>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  50%
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400 px-2.5 py-0.5 rounded-full">
                  ↗ 5% vs last month
                </span>
              </div>

              {/* Thick progress bar matching the mockup */}
              <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
                <div
                  className="h-full bg-zinc-900 rounded-full dark:bg-zinc-100"
                  style={{ width: "50%" }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Row 1 of Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Occupancy by Property Chart */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Occupancy by Property
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={occupancyByPropertyData}
                      margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, 2]}
                        ticks={[0, 0.5, 1, 1.5, 2]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip cursor={{ fill: "transparent" }} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="rect"
                        iconSize={12}
                        wrapperStyle={{ fontSize: 12 }}
                      />
                      <Bar
                        dataKey="Occupied"
                        fill="#2563EB"
                        radius={[4, 4, 0, 0]}
                        barSize={24}
                      />
                      <Bar
                        dataKey="Vacant"
                        fill="#E2E8F0"
                        radius={[4, 4, 0, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}
              </CardContent>
            </Card>

            {/* Unit Status Distribution Donut Chart */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Unit Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col justify-between">
                {isMounted ? (
                  <div className="h-[230px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={unitStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {unitStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} Units`} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered label inside donut */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-bold">50%</span>
                      <span className="text-xs text-muted-foreground">
                        Occupied
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-[230px] w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}

                {/* Custom Legend */}
                <div className="flex justify-center gap-6 pb-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                      Occupied: 50%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                      Vacant: 50%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2 of Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Occupancy Trend Area Chart */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Occupancy Trend (Last 5 Months)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={occupancyTrendData}
                      margin={{ top: 20, right: 10, left: -15, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRate"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip formatter={(v) => `${v}% Occupied`} />
                      <Area
                        type="monotone"
                        dataKey="Rate"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorRate)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}
              </CardContent>
            </Card>

            {/* Unit Types Pie Chart */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Unit Types
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col justify-between">
                {isMounted ? (
                  <div className="h-[230px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={unitTypesData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {unitTypesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} Units`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[230px] w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}

                {/* Custom Legend */}
                <div className="flex justify-center gap-4 pb-2 text-xs">
                  {unitTypesData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Occupancy Detail Table */}
          <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Property Occupancy Detail
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-900/50">
                      <th className="px-6 py-3.5">Property</th>
                      <th className="px-6 py-3.5 text-center">Total Units</th>
                      <th className="px-6 py-3.5 text-center">Occupied</th>
                      <th className="px-6 py-3.5 text-center">Vacant</th>
                      <th className="px-6 py-3.5 min-w-[200px]">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                    {propertyOccupancyDetails.map((row) => (
                      <tr
                        key={row.property}
                        className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                          {row.property}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-zinc-600 dark:text-zinc-400">
                          {row.total}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-zinc-600 dark:text-zinc-400">
                          {row.occupied}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-zinc-600 dark:text-zinc-400">
                          {row.vacant}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2.5 w-32 bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800 shrink-0">
                              <div
                                className="h-full bg-zinc-950 rounded-full dark:bg-zinc-100"
                                style={{ width: `${row.rate}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded-full">
                              {row.rate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── TAB 2: FINANCIAL REPORT ─────────────────────────────────────────── */}
      {activeTab === "Financial" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold tracking-tight">$52,000</p>
                  <p className="text-xs text-green-600 font-medium flex items-center gap-0.5 mt-0.5">
                    ↗ 12% vs last month
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                  <DollarSign className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Operating Expenses
                  </p>
                  <p className="text-3xl font-bold tracking-tight">$18,000</p>
                  <p className="text-xs text-red-600 font-medium flex items-center gap-0.5 mt-0.5">
                    ↗ 5% inflation impact
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Net Operating Income
                  </p>
                  <p className="text-3xl font-bold tracking-tight">$34,000</p>
                  <p className="text-xs text-muted-foreground">
                    65.3% Net Margin
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Outstanding Dues
                  </p>
                  <p className="text-3xl font-bold tracking-tight">$2,500</p>
                  <p className="text-xs text-amber-600 font-medium flex items-center gap-0.5 mt-0.5">
                    1 tenant pending
                  </p>
                </div>
                <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue vs Expenses Chart & Revenue Breakdown */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Monthly Financial Performance */}
            <Card className="md:col-span-2 rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Revenue vs Operating Expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={financialTrendData}
                      margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${v / 1000}k`}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        formatter={(value) =>
                          `$${(value as number).toLocaleString()}`
                        }
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="rect"
                        iconSize={12}
                        wrapperStyle={{ fontSize: 12 }}
                      />
                      <Bar
                        dataKey="Revenue"
                        fill="#2563EB"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                      <Bar
                        dataKey="Expenses"
                        fill="#EF4444"
                        radius={[4, 4, 0, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Revenue Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col justify-between">
                {isMounted ? (
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {revenueBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            `$${(value as number).toLocaleString()}`
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-2xs pb-1">
                  {revenueBreakdownData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1">
                      <div
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-zinc-500 font-medium truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Financial Transactions Table */}
          <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Recent Billings & Receipts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-900/50">
                      <th className="px-6 py-3.5">ID</th>
                      <th className="px-6 py-3.5">Tenant</th>
                      <th className="px-6 py-3.5">Property</th>
                      <th className="px-6 py-3.5 text-center">Amount</th>
                      <th className="px-6 py-3.5 text-center">Billing Date</th>
                      <th className="px-6 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                    {recentTransactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-semibold text-zinc-500">
                          {tx.id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                          {tx.tenant}
                        </td>
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                          {tx.property}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-zinc-900 dark:text-zinc-100">
                          ${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center text-zinc-500">
                          {tx.date}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              tx.status === "Paid"
                                ? "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400"
                                : "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── TAB 3: LEASES REPORT ────────────────────────────────────────────── */}
      {activeTab === "Leases" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Leases
                  </p>
                  <p className="text-3xl font-bold tracking-tight">4</p>
                </div>
                <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Expiring soon (90d)
                  </p>
                  <p className="text-3xl font-bold tracking-tight">2</p>
                  <p className="text-xs text-amber-600 font-medium">
                    Require renewals
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <Calendar className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Lease Term
                  </p>
                  <p className="text-3xl font-bold tracking-tight">2.5 Yrs</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <Clock className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Expired Leases
                  </p>
                  <p className="text-3xl font-bold tracking-tight">1</p>
                  <p className="text-xs text-red-600 font-medium">
                    Vacated or pending
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lease Status & Monthly Signings */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Lease Status breakdown */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Lease Distribution Status
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col justify-between">
                {isMounted ? (
                  <div className="h-[230px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leaseStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {leaseStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[230px] w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}

                {/* Legend */}
                <div className="flex justify-center gap-6 pb-2 text-xs">
                  {leaseStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lease signings chart */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  New Lease Signings Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={leaseSigningsData}
                      margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorSignings"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0.0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, 4]}
                        ticks={[0, 1, 2, 3, 4]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip formatter={(v) => `${v} Leases`} />
                      <Area
                        type="monotone"
                        dataKey="Signings"
                        stroke="#10B981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorSignings)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Expiring Leases Detail Table */}
          <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Upcoming Lease Expirations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-900/50">
                      <th className="px-6 py-3.5">Lease ID</th>
                      <th className="px-6 py-3.5">Tenant</th>
                      <th className="px-6 py-3.5">Unit</th>
                      <th className="px-6 py-3.5 text-center">Expiry Date</th>
                      <th className="px-6 py-3.5 text-center">
                        Action Required
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                    {expiringLeases.map((lease) => (
                      <tr
                        key={lease.id}
                        className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-semibold text-zinc-500">
                          {lease.id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                          {lease.tenant}
                        </td>
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                          {lease.unit}
                        </td>
                        <td className="px-6 py-4 text-center font-medium text-zinc-500">
                          {lease.expiry}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              lease.daysLeft > 0
                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                                : "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                            }`}
                          >
                            {lease.daysLeft > 0
                              ? `Expires in ${lease.daysLeft}d`
                              : `Expired ${Math.abs(lease.daysLeft)}d ago`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── TAB 4: WORK ORDERS REPORT ───────────────────────────────────────── */}
      {activeTab === "Work Orders" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Work Orders
                  </p>
                  <p className="text-3xl font-bold tracking-tight">5</p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <Wrench className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Open Orders
                  </p>
                  <p className="text-3xl font-bold tracking-tight">1</p>
                  <p className="text-xs text-red-600 font-medium">
                    Require attention
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    In Progress / Sched
                  </p>
                  <p className="text-3xl font-bold tracking-tight">2</p>
                </div>
                <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  <Clock className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardContent className="flex items-center justify-between p-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Completed
                  </p>
                  <p className="text-3xl font-bold tracking-tight">2</p>
                </div>
                <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Work Orders status & Category breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Work orders by status donut */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Work Orders by Status
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col justify-between">
                {isMounted ? (
                  <div className="h-[230px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={workOrderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          dataKey="value"
                        >
                          {workOrderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => `${v} Orders`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[230px] w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}

                {/* Legend */}
                <div className="flex justify-center gap-4 pb-2 text-xs">
                  {workOrderStatusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work orders by category bar chart */}
            <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  Orders by Category
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={workOrdersByCategory}
                      margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F1F5F9"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, 3]}
                        ticks={[0, 1, 2, 3]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip formatter={(v) => `${v} Orders`} />
                      <Bar
                        dataKey="Orders"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-zinc-50 dark:bg-zinc-800/30 animate-pulse rounded-lg" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Work Orders Detail Table */}
          <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Recent Work Order Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-900/50">
                      <th className="px-6 py-3.5">Task ID</th>
                      <th className="px-6 py-3.5">Title</th>
                      <th className="px-6 py-3.5">Property</th>
                      <th className="px-6 py-3.5 text-center">Priority</th>
                      <th className="px-6 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                    {activeWorkOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono font-semibold text-zinc-500">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                          {order.title}
                        </td>
                        <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                          {order.property}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              order.priority === "High"
                                ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                                : order.priority === "Medium"
                                  ? "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {order.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-zinc-500 font-medium">
                          {order.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
