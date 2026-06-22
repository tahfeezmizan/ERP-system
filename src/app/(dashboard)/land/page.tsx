"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetLandRecordsQuery } from "@/services/moduleApis";
import { formatBDT, formatNumber } from "@/lib/utils";
import type { LandRecord } from "@/types";
import { PermissionGate } from "@/components/shared/PermissionGate";

export default function LandPage() {
  const { data = [], isLoading } = useGetLandRecordsQuery();

  const columns: Column<LandRecord>[] = [
    { key: "mouza", header: "Mouza", cell: (r) => r.mouza, sortable: true },
    { key: "khatian", header: "Khatian", cell: (r) => r.khatian, sortable: true },
    { key: "dag", header: "Dag", cell: (r) => r.dag, sortable: true },
    { key: "area", header: "Area (Katha)", cell: (r) => formatNumber(r.area), sortable: true },
    { key: "valuation", header: "Valuation", cell: (r) => formatBDT(r.valuation), sortable: true },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "owners", header: "Owners", cell: (r) => r.owners.length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Land Management" description="Land acquisition, owners, and Bangladesh land records">
        <PermissionGate permission="land.create">
          <Button><Plus className="h-4 w-4 mr-1" /> Add Land Record</Button>
        </PermissionGate>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["mouza", "khatian", "dag"]} />
    </div>
  );
}
