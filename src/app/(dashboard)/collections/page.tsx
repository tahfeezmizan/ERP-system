"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { useGetCollectionsQuery, useCreateCollectionMutation } from "@/services/moduleApis";
import { createCollectionSchema, type CreateCollectionFormData } from "@/schemas";
import { formatBDT } from "@/lib/utils";
import type { Collection } from "@/types";

const COLLECTION_TYPES = ["Booking Money", "Down Payment", "Installment", "Late Fee"] as const;
const PAYMENT_METHODS = ["Cash", "Bank Transfer", "Cheque", "Mobile Banking"] as const;

export default function CollectionsPage() {
  const { data = [], isLoading, refetch } = useGetCollectionsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCollection] = useCreateCollectionMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCollectionFormData>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      customerName: "",
      amount: undefined,
      type: "Installment",
      paymentDate: "",
      paymentMethod: "Bank Transfer",
    },
  });

  const typeValue = watch("type");
  const methodValue = watch("paymentMethod");

  const columns: Column<Collection>[] = [
    { key: "receiptNo", header: "Receipt No", cell: (r) => r.receiptNo, sortable: true },
    { key: "customerName", header: "Customer", cell: (r) => r.customerName, sortable: true },
    { key: "type", header: "Type", cell: (r) => r.type },
    { key: "amount", header: "Amount", cell: (r) => formatBDT(r.amount), sortable: true },
    { key: "paymentDate", header: "Date", cell: (r) => r.paymentDate, sortable: true },
    { key: "paymentMethod", header: "Method", cell: (r) => r.paymentMethod },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  async function onSubmit(values: CreateCollectionFormData) {
    try {
      await createCollection(values).unwrap();
      toast.success("Collection recorded successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to record collection");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Collections" description="Payment collection, EMI schedules, and money receipts">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Record Collection
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchKeys={["receiptNo", "customerName"]}
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Record Collection"
        description="Record a new payment from a customer"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="coll-customer">Customer Name</Label>
            <Input id="coll-customer" placeholder="e.g. Mohammad Hasan" {...register("customerName")} />
            {errors.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coll-type">Payment Type</Label>
            <Select value={typeValue} onValueChange={(v) => setValue("type", v as CreateCollectionFormData["type"])}>
              <SelectTrigger id="coll-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {COLLECTION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coll-method">Payment Method</Label>
            <Select value={methodValue} onValueChange={(v) => setValue("paymentMethod", v as CreateCollectionFormData["paymentMethod"])}>
              <SelectTrigger id="coll-method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coll-amount">Amount (৳)</Label>
            <Input id="coll-amount" type="number" placeholder="e.g. 500000" {...register("amount")} />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="coll-date">Payment Date</Label>
            <Input id="coll-date" type="date" {...register("paymentDate")} />
            {errors.paymentDate && <p className="text-sm text-destructive">{errors.paymentDate.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
