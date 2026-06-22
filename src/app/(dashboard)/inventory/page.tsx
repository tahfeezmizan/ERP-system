"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { useGetItemsQuery } from "@/services/moduleApis";
import { formatBDT, formatNumber } from "@/lib/utils";

type Item = {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  value: number;
};

export default function InventoryPage() {
  const { data = [], isLoading } = useGetItemsQuery();

  const columns: Column<Item>[] = [
    { key: "name", header: "Material", cell: (r) => r.name, sortable: true },
    { key: "category", header: "Category", cell: (r) => r.category, sortable: true },
    { key: "stock", header: "Stock", cell: (r) => `${formatNumber(r.stock)} ${r.unit}`, sortable: true },
    { key: "reorderLevel", header: "Reorder Level", cell: (r) => formatNumber(r.reorderLevel) },
    { key: "value", header: "Value", cell: (r) => formatBDT(r.value), sortable: true },
    {
      key: "alert",
      header: "Status",
      cell: (r) => (
        <span className={r.stock <= r.reorderLevel ? "text-danger font-medium" : "text-success"}>
          {r.stock <= r.reorderLevel ? "Low Stock" : "In Stock"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory & Store" description="Material stock, warehouse, and consumption tracking">
        <Button><Plus className="h-4 w-4 mr-1" /> Stock In</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "category"]} />
    </div>
  );
}
