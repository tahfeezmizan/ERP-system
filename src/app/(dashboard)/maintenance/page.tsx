"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetComplaintsQuery } from "@/services/moduleApis";

type Complaint = {
  id: string;
  ticketNo: string;
  customer: string;
  unit: string;
  issue: string;
  status: string;
  priority: string;
};

export default function MaintenancePage() {
  const { data = [], isLoading } = useGetComplaintsQuery();

  const columns: Column<Complaint>[] = [
    { key: "ticketNo", header: "Ticket", cell: (r) => r.ticketNo, sortable: true },
    { key: "customer", header: "Customer", cell: (r) => r.customer, sortable: true },
    { key: "unit", header: "Unit", cell: (r) => r.unit },
    { key: "issue", header: "Issue", cell: (r) => r.issue },
    { key: "priority", header: "Priority", cell: (r) => <StatusBadge status={r.priority} /> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Service & Maintenance" description="Complaints, tickets, warranty, and AMC management">
        <Button><Plus className="h-4 w-4 mr-1" /> New Ticket</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["ticketNo", "customer", "issue"]} />
    </div>
  );
}
