"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { DataTable, type Column } from "@/components/tables/DataTable";
import {
  useCreateUnitMutation,
  useDeleteUnitMutation,
  useGetPropertiesQuery,
  useGetUnitsQuery,
  useUpdateUnitMutation,
} from "@/services/moduleApis";
import { unitSchema, type UnitFormData } from "@/schemas";
import { formatNumber, formatUSD } from "@/lib/utils";
import type { PropertyUnit, UnitOccupancyStatus, UnitSpaceType } from "@/types";

const UNIT_TYPES: UnitSpaceType[] = ["Office", "Apartment"];
const STATUS_FILTER_OPTIONS = ["All Status", "occupied", "vacant"] as const;

const defaultFormValues: UnitFormData = {
  unit: "",
  propertyName: "",
  type: "Office",
  floor: 0,
  area: 0,
  status: "vacant",
  marketRent: 0,
};

export default function UnitsPage() {
  const { data: units = [], isLoading } = useGetUnitsQuery();
  const { data: properties = [] } = useGetPropertiesQuery();
  const [createUnit] = useCreateUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<PropertyUnit | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTER_OPTIONS)[number]>("All Status");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: defaultFormValues,
  });

  const typeValue = watch("type");
  const statusValue = watch("status");
  const propertyNameValue = watch("propertyName");

  const filteredData = useMemo(() => {
    if (statusFilter === "All Status") return units;
    return units.filter((unit) => unit.status === statusFilter);
  }, [units, statusFilter]);

  const propertyOptions = useMemo(() => {
    const names = properties.map((property) => property.name);
    if (editingUnit && !names.includes(editingUnit.propertyName)) {
      return [editingUnit.propertyName, ...names];
    }
    return names;
  }, [properties, editingUnit]);

  const columns: Column<PropertyUnit>[] = [
    {
      key: "unit",
      header: "Unit",
      cell: (row) => <span className="font-semibold">{row.unit}</span>,
      sortable: true,
    },
    {
      key: "propertyName",
      header: "Property",
      cell: (row) => row.propertyName,
      sortable: true,
    },
    { key: "type", header: "Type", cell: (row) => row.type, sortable: true },
    { key: "floor", header: "Floor", cell: (row) => row.floor, sortable: true },
    {
      key: "area",
      header: "Area (sqft)",
      cell: (row) => formatNumber(row.area),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) =>
        row.status === "occupied" ? (
          <Badge
            variant="success"
            className="rounded-full px-2.5 py-0.5 font-normal capitalize"
          >
            {row.status}
          </Badge>
        ) : (
          <span className="text-sm capitalize text-muted-foreground">{row.status}</span>
        ),
    },
    {
      key: "marketRent",
      header: "Market Rent",
      cell: (row) => formatUSD(row.marketRent),
      sortable: true,
    },
  ];

  function openCreateModal() {
    setEditingUnit(null);
    reset({
      ...defaultFormValues,
      propertyName: propertyOptions[0] ?? "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(unit: PropertyUnit) {
    setEditingUnit(unit);
    reset({
      unit: unit.unit,
      propertyName: unit.propertyName,
      type: unit.type,
      floor: unit.floor,
      area: unit.area,
      status: unit.status,
      marketRent: unit.marketRent,
    });
    setIsModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setEditingUnit(null);
      reset(defaultFormValues);
    }
  }

  async function onSubmit(values: UnitFormData) {
    try {
      if (editingUnit) {
        await updateUnit({ id: editingUnit.id, data: values }).unwrap();
        toast.success("Unit updated successfully");
      } else {
        await createUnit(values).unwrap();
        toast.success("Unit added successfully");
      }
      handleModalChange(false);
    } catch {
      toast.error(editingUnit ? "Failed to update unit" : "Failed to add unit");
    }
  }

  async function handleDelete(unit: PropertyUnit) {
    if (!window.confirm(`Delete unit "${unit.unit}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUnit(unit.id).unwrap();
      toast.success("Unit deleted successfully");
    } catch {
      toast.error("Failed to delete unit");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Units" description="Manage property units and spaces">
        <Button onClick={openCreateModal}>
          <Plus className="mr-1 h-4 w-4" /> Add Unit
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchKeys={["unit", "propertyName", "type"]}
        hideExportPrint
        onRowEdit={openEditModal}
        onRowDelete={handleDelete}
        toolbarExtra={
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as (typeof STATUS_FILTER_OPTIONS)[number])
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTER_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "All Status" ? status : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        title={editingUnit ? "Edit Unit" : "Add Unit"}
        description={
          editingUnit
            ? "Update unit details for this property"
            : "Add a new unit to a property"
        }
        submitLabel={editingUnit ? "Update" : "Save"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="unit-name">Unit</Label>
            <Input id="unit-name" placeholder="e.g. Suite 101" {...register("unit")} />
            {errors.unit && (
              <p className="text-sm text-destructive">{errors.unit.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit-property">Property</Label>
            <Select
              value={propertyNameValue}
              onValueChange={(value) =>
                setValue("propertyName", value, { shouldValidate: true })
              }
            >
              <SelectTrigger id="unit-property">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {propertyOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyName && (
              <p className="text-sm text-destructive">{errors.propertyName.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit-type">Type</Label>
            <Select
              value={typeValue}
              onValueChange={(value) =>
                setValue("type", value as UnitSpaceType, { shouldValidate: true })
              }
            >
              <SelectTrigger id="unit-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit-floor">Floor</Label>
            <Input
              id="unit-floor"
              type="number"
              min={0}
              placeholder="e.g. 1"
              {...register("floor")}
            />
            {errors.floor && (
              <p className="text-sm text-destructive">{errors.floor.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit-area">Area (sqft)</Label>
            <Input
              id="unit-area"
              type="number"
              min={0}
              placeholder="e.g. 1200"
              {...register("area")}
            />
            {errors.area && (
              <p className="text-sm text-destructive">{errors.area.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit-status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setValue("status", value as UnitOccupancyStatus, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="unit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="unit-rent">Market Rent ($)</Label>
            <Input
              id="unit-rent"
              type="number"
              min={0}
              placeholder="e.g. 2500"
              {...register("marketRent")}
            />
            {errors.marketRent && (
              <p className="text-sm text-destructive">{errors.marketRent.message}</p>
            )}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
