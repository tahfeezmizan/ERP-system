"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatBDT } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateProcurementFormData, createProcurementSchema } from "@/schemas";
import { useCreateOrderMutation, useGetOrdersQuery } from "@/services/moduleApis";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Order = {
  id: string;
  poNo: string;
  vendor: string;
  amount: number;
  status: string;
  date: string;
};

export default function ProcurementPage() {
  const { data = [], isLoading, refetch } = useGetOrdersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createOrder] = useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProcurementFormData>({
    resolver: zodResolver(createProcurementSchema) as any,
    defaultValues: {
      vendor: "",
      amount: undefined,
      date: "",
      description: "",
    },
  });

  const columns: Column<Order>[] = [
    { key: "poNo", header: "PO No", cell: (r) => r.poNo, sortable: true },
    { key: "vendor", header: "Vendor", cell: (r) => r.vendor, sortable: true },
    { key: "amount", header: "Amount", cell: (r) => formatBDT(r.amount), sortable: true },
    { key: "date", header: "Date", cell: (r) => r.date, sortable: true },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  async function onSubmit(values: CreateProcurementFormData) {
    try {
      await createOrder(values).unwrap();
      toast.success("Purchase requisition created successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to create requisition");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Procurement" description="Purchase requisitions, RFQ, PO, and goods receive">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Requisition
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["poNo", "vendor"]} />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="New Purchase Requisition"
        description="Raise a purchase order or material requisition"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="po-vendor">Vendor / Supplier</Label>
            <Input id="po-vendor" placeholder="e.g. BuildMart Supplies" {...register("vendor")} />
            {errors.vendor && <p className="text-sm text-destructive">{errors.vendor.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="po-amount">Amount (৳)</Label>
            <Input id="po-amount" type="number" placeholder="e.g. 2500000" {...register("amount")} />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="po-date">Requisition Date</Label>
            <Input id="po-date" type="date" {...register("date")} />
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="po-description">Description / Items</Label>
            <Textarea
              id="po-description"
              placeholder="e.g. Cement OPC 53 – 500 bags, Rod 60 Grade – 10 ton"
              rows={3}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
