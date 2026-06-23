"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBDT, formatNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateInventoryItemFormData, createInventoryItemSchema } from "@/schemas";
import { useCreateItemMutation, useGetItemsQuery } from "@/services/moduleApis";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  const { data = [], isLoading, refetch } = useGetItemsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createItem] = useCreateItemMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateInventoryItemFormData>({
    resolver: zodResolver(createInventoryItemSchema) as any,
    defaultValues: {
      name: "",
      category: "",
      stock: undefined,
      unit: "",
      reorderLevel: undefined,
      value: undefined,
    },
  });

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

  async function onSubmit(values: CreateInventoryItemFormData) {
    try {
      await createItem(values).unwrap();
      toast.success("Stock item added successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to add stock item");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory & Store" description="Material stock, warehouse, and consumption tracking">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Stock In
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "category"]} />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Stock In — Add Item"
        description="Add a new material or update stock levels"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="inv-name">Material / Item Name</Label>
            <Input id="inv-name" placeholder="e.g. Cement OPC 53" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-category">Category</Label>
            <Input id="inv-category" placeholder="e.g. Cement" {...register("category")} />
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-unit">Unit</Label>
            <Input id="inv-unit" placeholder="e.g. Bag, Ton, Pcs" {...register("unit")} />
            {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-stock">Opening Stock Qty</Label>
            <Input id="inv-stock" type="number" placeholder="e.g. 850" {...register("stock")} />
            {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inv-reorder">Reorder Level</Label>
            <Input id="inv-reorder" type="number" placeholder="e.g. 200" {...register("reorderLevel")} />
            {errors.reorderLevel && <p className="text-sm text-destructive">{errors.reorderLevel.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="inv-value">Total Value (৳)</Label>
            <Input id="inv-value" type="number" placeholder="e.g. 425000" {...register("value")} />
            {errors.value && <p className="text-sm text-destructive">{errors.value.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
