"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { useGetContractorsQuery } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";

type Contractor = {
  id: string;
  name: string;
  type: string;
  activeProjects: number;
  rating: number;
  pendingBills: number;
};

export default function ContractorsPage() {
  const { data = [], isLoading } = useGetContractorsQuery();

  const columns: Column<Contractor>[] = [
    { key: "name", header: "Contractor", cell: (r) => r.name, sortable: true },
    { key: "type", header: "Type", cell: (r) => r.type },
    { key: "activeProjects", header: "Active Projects", cell: (r) => r.activeProjects, sortable: true },
    { key: "rating", header: "Rating", cell: (r) => `${r.rating} / 5` },
    { key: "pendingBills", header: "Pending Bills", cell: (r) => formatBDT(r.pendingBills), sortable: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Contractor Management" description="Contracts, work orders, bills, and payments">
        <Button><Plus className="h-4 w-4 mr-1" /> Add Contractor</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "type"]} />
    </div>
  );
}
