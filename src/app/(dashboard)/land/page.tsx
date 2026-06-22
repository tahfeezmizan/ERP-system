"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatBDT, formatNumber } from "@/lib/utils";
import { type CreateLandRecordFormData } from "@/schemas";
import { useCreateLandRecordMutation, useGetLandRecordsQuery } from "@/services/moduleApis";
import type { LandRecord } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LandPage() {
  const { data = [], isLoading, refetch } = useGetLandRecordsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLandRecord] = useCreateLandRecordMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateLandRecordFormData>({
    defaultValues: { mouza: "", khatian: "", dag: "", area: undefined, valuation: undefined, status: "Pending" },
  });

  const statusValue = watch("status");

  const columns: Column<LandRecord>[] = [
    { key: "mouza", header: "Mouza", cell: (r) => r.mouza, sortable: true },
    { key: "khatian", header: "Khatian", cell: (r) => r.khatian, sortable: true },
    { key: "dag", header: "Dag", cell: (r) => r.dag, sortable: true },
    { key: "area", header: "Area (Katha)", cell: (r) => formatNumber(r.area), sortable: true },
    { key: "valuation", header: "Valuation", cell: (r) => formatBDT(r.valuation), sortable: true },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "owners", header: "Owners", cell: (r) => r.owners.length },
  ];

  async function onSubmit(values: CreateLandRecordFormData) {
    try {
      await createLandRecord(values).unwrap();
      toast.success("Land record created successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to create land record");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Land Management" description="Land acquisition, owners, and Bangladesh land records">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Land Record
        </Button>
      </PageHeader>
      
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["mouza", "khatian", "dag"]} />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Land Record"
        description="Enter Bangladesh land registry details"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="mouza">Mouza</Label>
            <Input id="mouza" placeholder="e.g. Uttara" {...register("mouza")} />
            {errors.mouza && <p className="text-sm text-destructive">{errors.mouza.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="khatian">Khatian No.</Label>
            <Input id="khatian" placeholder="e.g. 125" {...register("khatian")} />
            {errors.khatian && <p className="text-sm text-destructive">{errors.khatian.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dag">Dag No.</Label>
            <Input id="dag" placeholder="e.g. 456" {...register("dag")} />
            {errors.dag && <p className="text-sm text-destructive">{errors.dag.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="area">Area (Katha)</Label>
            <Input id="area" type="number" step="0.01" placeholder="e.g. 5.2" {...register("area")} />
            {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="valuation">Valuation (৳)</Label>
            <Input id="valuation" type="number" placeholder="e.g. 5200000" {...register("valuation")} />
            {errors.valuation && <p className="text-sm text-destructive">{errors.valuation.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusValue} onValueChange={(v) => setValue("status", v as CreateLandRecordFormData["status"])}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Acquired">Acquired</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="csRecord">CS Record (optional)</Label>
            <Input id="csRecord" placeholder="e.g. CS-125/456" {...register("csRecord")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rsRecord">RS Record (optional)</Label>
            <Input id="rsRecord" placeholder="e.g. RS-125/456" {...register("rsRecord")} />
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
