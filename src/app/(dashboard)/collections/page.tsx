"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetCollectionsQuery } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";
import type { Collection } from "@/types";

export default function CollectionsPage() {
  const { data = [], isLoading } = useGetCollectionsQuery();

  const columns: Column<Collection>[] = [
    { key: "receiptNo", header: "Receipt No", cell: (r) => r.receiptNo, sortable: true },
    { key: "customerName", header: "Customer", cell: (r) => r.customerName, sortable: true },
    { key: "type", header: "Type", cell: (r) => r.type },
    { key: "amount", header: "Amount", cell: (r) => formatBDT(r.amount), sortable: true },
    { key: "paymentDate", header: "Date", cell: (r) => r.paymentDate, sortable: true },
    { key: "paymentMethod", header: "Method", cell: (r) => r.paymentMethod },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Collections" description="Payment collection, EMI schedules, and money receipts">
        <Button><Plus className="h-4 w-4 mr-1" /> Record Collection</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["receiptNo", "customerName"]} />
    </div>
  );
}
