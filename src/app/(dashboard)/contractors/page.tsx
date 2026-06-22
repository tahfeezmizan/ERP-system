"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatBDT } from "@/lib/utils";
import { type CreateContractorFormData } from "@/schemas";
import { useCreateContractorMutation, useGetContractorsQuery } from "@/services/moduleApis";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Contractor = {
  id: string;
  name: string;
  type: string;
  activeProjects: number;
  rating: number;
  pendingBills: number;
};

const CONTRACTOR_TYPES = [
  "Main Contractor",
  "Civil",
  "Electrical",
  "Plumbing",
  "Painting",
  "Interior",
  "Landscaping",
  "Other",
];

export default function ContractorsPage() {
  const { data = [], isLoading, refetch } = useGetContractorsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createContractor] = useCreateContractorMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateContractorFormData>({
    defaultValues: { name: "", type: "", rating: undefined },
  });

  const typeValue = watch("type");

  const columns: Column<Contractor>[] = [
    { key: "name", header: "Contractor", cell: (r) => r.name, sortable: true },
    { key: "type", header: "Type", cell: (r) => r.type },
    { key: "activeProjects", header: "Active Projects", cell: (r) => r.activeProjects, sortable: true },
    { key: "rating", header: "Rating", cell: (r) => `${r.rating} / 5` },
    { key: "pendingBills", header: "Pending Bills", cell: (r) => formatBDT(r.pendingBills), sortable: true },
  ];

  async function onSubmit(values: CreateContractorFormData) {
    try {
      await createContractor(values).unwrap();
      toast.success("Contractor added successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to add contractor");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Contractor Management" description="Contracts, work orders, bills, and payments">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Contractor
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "type"]} />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Contractor"
        description="Register a new contractor or vendor company"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="con-name">Company / Contractor Name</Label>
            <Input id="con-name" placeholder="e.g. ABC Construction Ltd." {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="con-type">Contractor Type</Label>
            <Select value={typeValue} onValueChange={(v) => setValue("type", v)}>
              <SelectTrigger id="con-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {CONTRACTOR_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="con-rating">Initial Rating (1–5)</Label>
            <Input id="con-rating" type="number" min={1} max={5} step={0.1} placeholder="e.g. 4.5" {...register("rating")} />
            {errors.rating && <p className="text-sm text-destructive">{errors.rating.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
