"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetOrdersQuery } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";

type Order = {
  id: string;
  poNo: string;
  vendor: string;
  amount: number;
  status: string;
  date: string;
};

export default function ProcurementPage() {
  const { data = [], isLoading } = useGetOrdersQuery();

  const columns: Column<Order>[] = [
    { key: "poNo", header: "PO No", cell: (r) => r.poNo, sortable: true },
    { key: "vendor", header: "Vendor", cell: (r) => r.vendor, sortable: true },
    { key: "amount", header: "Amount", cell: (r) => formatBDT(r.amount), sortable: true },
    { key: "date", header: "Date", cell: (r) => r.date, sortable: true },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Procurement" description="Purchase requisitions, RFQ, PO, and goods receive">
        <Button><Plus className="h-4 w-4 mr-1" /> New Requisition</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["poNo", "vendor"]} />
    </div>
  );
}
