"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetUnitsQuery } from "@/services/moduleApis";
import { formatBDT, formatNumber } from "@/lib/utils";
import type { PropertyUnit } from "@/types";

export default function PropertiesPage() {
  const { data = [], isLoading } = useGetUnitsQuery();

  const columns: Column<PropertyUnit>[] = [
    { key: "unitNumber", header: "Unit", cell: (r) => r.unitNumber, sortable: true },
    { key: "projectName", header: "Project", cell: (r) => r.projectName, sortable: true },
    { key: "building", header: "Building", cell: (r) => r.building },
    { key: "unitType", header: "Type", cell: (r) => r.unitType },
    { key: "area", header: "Area (sqft)", cell: (r) => formatNumber(r.area), sortable: true },
    { key: "facing", header: "Facing", cell: (r) => r.facing },
    { key: "price", header: "Price", cell: (r) => formatBDT(r.price), sortable: true },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Properties" description="Unit inventory — Project → Building → Block → Floor → Unit">
        <Button><Plus className="h-4 w-4 mr-1" /> Add Unit</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["unitNumber", "projectName", "unitType"]} />
    </div>
  );
}
