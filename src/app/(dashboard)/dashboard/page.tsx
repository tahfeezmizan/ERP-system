"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Building2,
  DoorOpen,
  FileText,
  TrendingUp,
  User,
  Wrench,
} from "lucide-react";

const EXPIRING_LEASES = [
  {
    id: "1",
    tenant: "TechStart Inc",
    location: "Grand Plaza Corporate Center - Unit Suite 102",
    daysLeft: 36,
    expiryDate: "2026-06-30",
  },
  {
    id: "2",
    tenant: "Jane Miller",
    location: "Oakridge Residential Towers - Unit A-2",
    daysLeft: 21,
    expiryDate: "2026-06-15",
  },
];

const RECENT_WORK_ORDERS = [
  {
    id: "1",
    title: "HVAC Maintenance",
    location: "Grand Plaza Corporate Center",
    priority: "medium" as const,
    status: "Completed",
  },
  {
    id: "2",
    title: "Leaking Faucet in A-1",
    location: "Oakridge Residential Towers",
    priority: "high" as const,
    status: "In Progress",
  },
  {
    id: "3",
    title: "Elevator Inspection",
    location: "Grand Plaza Corporate Center",
    priority: "high" as const,
    status: "Scheduled",
  },
  {
    id: "4",
    title: "lobby Light Bulbs Replacement",
    location: "Oakridge Residential Towers",
    priority: "low" as const,
    status: "Open",
  },
];

function priorityVariant(priority: "low" | "medium" | "high") {
  if (priority === "high") return "warning";
  return "secondary";
}

function daysLeftVariant(days: number) {
  return days <= 30 ? "danger" : "warning";
}

const METRIC_CARDS = [
  {
    label: "Properties",
    value: 3,
    subtitle: "10 total units",
    icon: Building2,
    iconClassName: "text-blue-600",
    iconBgClassName: "bg-blue-50",
  },
  {
    label: "Occupancy Rate",
    value: "50%",
    subtitle: "5 occupied / 10 total",
    icon: DoorOpen,
    iconClassName: "text-green-600",
    iconBgClassName: "bg-green-50",
    progress: 50,
  },
  {
    label: "Active Leases",
    value: 4,
    subtitle: "2 expiring soon",
    icon: FileText,
    iconClassName: "text-purple-600",
    iconBgClassName: "bg-purple-50",
    alert: {
      text: "2 expiring",
      variant: "warning" as const,
      direction: "down" as const,
    },
  },
  {
    label: "Open Work Orders",
    value: 2,
    subtitle: "2 overdue",
    icon: Wrench,
    iconClassName: "text-orange-600",
    iconBgClassName: "bg-orange-50",
    alert: {
      text: "2 overdue",
      variant: "danger" as const,
      direction: "up" as const,
    },
  },
];

const STAT_CARDS = [
  {
    label: "Outstanding Invoices",
    value: "$10,000",
    icon: AlertTriangle,
    iconClassName: "text-red-600",
    iconBgClassName: "bg-red-50",
  },
  {
    label: "Total Tenants",
    value: 4,
    icon: User,
    iconClassName: "text-blue-600",
    iconBgClassName: "bg-blue-50",
  },
  {
    label: "Monthly Revenue",
    value: "$24,500",
    icon: TrendingUp,
    iconClassName: "text-green-600",
    iconBgClassName: "bg-green-50",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your real estate portfolio"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRIC_CARDS.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Expiring Leases (90 days)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {EXPIRING_LEASES.map((lease) => (
              <div
                key={lease.id}
                className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{lease.tenant}</p>
                  <p className="text-sm text-muted-foreground">
                    {lease.location}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge variant={daysLeftVariant(lease.daysLeft)}>
                    {lease.daysLeft} days
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lease.expiryDate}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Recent Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {RECENT_WORK_ORDERS.map((order) => (
              <div
                key={order.id}
                className="flex items-start justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="font-semibold">{order.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.location}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge variant={priorityVariant(order.priority)}>
                    {order.priority}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
