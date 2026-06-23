"use client";

import {
  AlertTriangle,
  Building2,
  DoorOpen,
  FileText,
  TrendingDown,
  TrendingUp,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBgClassName: string;
  progress?: number;
  alert?: {
    text: string;
    variant: "warning" | "danger";
    direction: "up" | "down";
  };
}

function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  iconBgClassName,
  progress,
  alert,
}: MetricCardProps) {
  const AlertIcon = alert?.direction === "up" ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("shrink-0 rounded-lg p-2.5", iconBgClassName)}>
            <Icon className={cn("h-5 w-5", iconClassName)} />
          </div>
        </div>

        {progress !== undefined && (
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {alert && (
          <div
            className={cn(
              "mt-3 flex items-center gap-1 text-xs font-medium",
              alert.variant === "warning" && "text-warning",
              alert.variant === "danger" && "text-danger"
            )}
          >
            <AlertIcon className="h-3.5 w-3.5" />
            <span>{alert.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName: string;
  iconBgClassName: string;
}

function StatCard({ label, value, icon: Icon, iconClassName, iconBgClassName }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={cn("rounded-lg p-2.5", iconBgClassName)}>
          <Icon className={cn("h-5 w-5", iconClassName)} />
        </div>
      </CardContent>
    </Card>
  );
}

const WORK_ORDER_STATUSES = [
  { count: 1, label: "Open" },
  { count: 1, label: "In_progress" },
  { count: 1, label: "Completed" },
  { count: 1, label: "Scheduled" },
];

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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your real estate portfolio"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Properties"
          value={3}
          subtitle="10 total units"
          icon={Building2}
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-50"
        />
        <MetricCard
          label="Occupancy Rate"
          value="50%"
          subtitle="5 occupied / 10 total"
          icon={DoorOpen}
          iconClassName="text-green-600"
          iconBgClassName="bg-green-50"
          progress={50}
        />
        <MetricCard
          label="Active Leases"
          value={4}
          subtitle="2 expiring soon"
          icon={FileText}
          iconClassName="text-purple-600"
          iconBgClassName="bg-purple-50"
          alert={{ text: "2 expiring", variant: "warning", direction: "down" }}
        />
        <MetricCard
          label="Open Work Orders"
          value={2}
          subtitle="2 overdue"
          icon={Wrench}
          iconClassName="text-orange-600"
          iconBgClassName="bg-orange-50"
          alert={{ text: "2 overdue", variant: "danger", direction: "up" }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Outstanding Invoices"
          value="$10,000"
          icon={AlertTriangle}
          iconClassName="text-red-600"
          iconBgClassName="bg-red-50"
        />
        <StatCard
          label="Total Tenants"
          value={4}
          icon={User}
          iconClassName="text-blue-600"
          iconBgClassName="bg-blue-50"
        />
        <Card className="md:col-span-2 xl:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-muted-foreground">Work Orders by Status</p>
              <div className="rounded-lg bg-orange-50 p-2.5">
                <Wrench className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {WORK_ORDER_STATUSES.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
                  <p className="text-sm text-muted-foreground">{lease.location}</p>
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
                  <p className="text-sm text-muted-foreground">{order.location}</p>
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
