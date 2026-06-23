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
import { useGetUnitsQuery, useCreateUnitMutation } from "@/services/moduleApis";
import { createPropertyUnitSchema, type CreatePropertyUnitFormData } from "@/schemas";
import { formatBDT, formatNumber } from "@/lib/utils";
import type { PropertyUnit } from "@/types";

const UNIT_TYPES = ["Apartment", "Commercial", "Parking", "Shop", "Roof Rights"] as const;
const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

export default function PropertiesPage() {
  const { data = [], isLoading, refetch } = useGetUnitsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createUnit] = useCreateUnitMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePropertyUnitFormData>({

    defaultValues: {
      projectName: "",
      building: "",
      block: "",
      floor: undefined,
      unitNumber: "",
      unitType: "Apartment",
      area: undefined,
      facing: "",
      price: undefined,
    },
  });

  const unitTypeValue = watch("unitType");
  const facingValue = watch("facing");

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

  async function onSubmit(values: CreatePropertyUnitFormData) {
    try {
      await createUnit(values).unwrap();
      toast.success("Unit added successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to add unit");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Properties" description="Unit inventory — Project → Building → Block → Floor → Unit">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Unit
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchKeys={["unitNumber", "projectName", "unitType"]}
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Property Unit"
        description="Add a new unit to the inventory"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="unit-project">Project Name</Label>
            <Input id="unit-project" placeholder="e.g. Green Valley Residency" {...register("projectName")} />
            {errors.projectName && <p className="text-sm text-destructive">{errors.projectName.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-building">Building</Label>
            <Input id="unit-building" placeholder="e.g. Tower A" {...register("building")} />
            {errors.building && <p className="text-sm text-destructive">{errors.building.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-block">Block</Label>
            <Input id="unit-block" placeholder="e.g. Block 1" {...register("block")} />
            {errors.block && <p className="text-sm text-destructive">{errors.block.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-floor">Floor</Label>
            <Input id="unit-floor" type="number" min={0} placeholder="e.g. 5" {...register("floor")} />
            {errors.floor && <p className="text-sm text-destructive">{errors.floor.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-number">Unit Number</Label>
            <Input id="unit-number" placeholder="e.g. A-501" {...register("unitNumber")} />
            {errors.unitNumber && <p className="text-sm text-destructive">{errors.unitNumber.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-type">Unit Type</Label>
            <Select value={unitTypeValue} onValueChange={(v) => setValue("unitType", v as CreatePropertyUnitFormData["unitType"])}>
              <SelectTrigger id="unit-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unitType && <p className="text-sm text-destructive">{errors.unitType.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-area">Area (sqft)</Label>
            <Input id="unit-area" type="number" placeholder="e.g. 1250" {...register("area")} />
            {errors.area && <p className="text-sm text-destructive">{errors.area.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit-facing">Facing</Label>
            <Select value={facingValue} onValueChange={(v) => setValue("facing", v)}>
              <SelectTrigger id="unit-facing">
                <SelectValue placeholder="Select facing" />
              </SelectTrigger>
              <SelectContent>
                {FACING_OPTIONS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.facing && <p className="text-sm text-destructive">{errors.facing.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="unit-price">Price (৳)</Label>
            <Input id="unit-price" type="number" placeholder="e.g. 8000000" {...register("price")} />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
