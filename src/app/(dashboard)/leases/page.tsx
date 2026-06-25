"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatUSD } from "@/lib/utils";
import { type LeaseFormData } from "@/schemas";
import {
  useCreateLeaseMutation,
  useDeleteLeaseMutation,
  useGetLeasesQuery,
  useGetPropertiesQuery,
  useGetUnitsQuery,
  useUpdateLeaseMutation,
} from "@/services/moduleApis";
import type { Lease, LeaseStatus, LeaseType } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LEASE_TYPES: LeaseType[] = ["Commercial", "Residential"];
const STATUS_FILTER_OPTIONS = [
  "All Status",
  "active",
  "expiring",
  "expired",
  "terminated",
] as const;

const defaultFormValues: LeaseFormData = {
  tenant: "",
  propertyName: "",
  unit: "",
  type: "Commercial",
  baseRent: 0,
  startDate: "",
  endDate: "",
  status: "active",
};

function leaseStatusBadge(status: LeaseStatus) {
  if (status === "expiring") {
    return (
      <Badge className="rounded-full border-transparent bg-orange-500 px-2.5 py-0.5 font-normal capitalize text-white">
        Expiring
      </Badge>
    );
  }

  const variant =
    status === "active"
      ? "success"
      : status === "expired" || status === "terminated"
        ? "secondary"
        : "secondary";

  return (
    <Badge
      variant={variant}
      className="rounded-full px-2.5 py-0.5 font-normal capitalize"
    >
      {status}
    </Badge>
  );
}

export default function LeasesPage() {
  const { data: leases = [], isLoading } = useGetLeasesQuery();
  const { data: properties = [] } = useGetPropertiesQuery();
  const { data: units = [] } = useGetUnitsQuery();
  const [createLease] = useCreateLeaseMutation();
  const [updateLease] = useUpdateLeaseMutation();
  const [deleteLease] = useDeleteLeaseMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLease, setEditingLease] = useState<Lease | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTER_OPTIONS)[number]>("All Status");
  const [viewExpiringOnly, setViewExpiringOnly] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaseFormData>({
    defaultValues: defaultFormValues,
  });

  const typeValue = watch("type");
  const statusValue = watch("status");
  const propertyNameValue = watch("propertyName");

  const propertyOptions = useMemo(() => {
    const names = properties.map((property) => property.name);
    if (editingLease && !names.includes(editingLease.propertyName)) {
      return [editingLease.propertyName, ...names];
    }
    return names;
  }, [properties, editingLease]);

  const unitOptions = useMemo(() => {
    const filtered = units
      .filter((u) => u.propertyName === propertyNameValue)
      .map((u) => u.unit);
    if (editingLease?.unit && !filtered.includes(editingLease.unit)) {
      return [editingLease.unit, ...filtered];
    }
    return filtered;
  }, [units, propertyNameValue, editingLease]);

  const filteredData = useMemo(() => {
    let result = leases;

    if (viewExpiringOnly) {
      result = result.filter((lease) => lease.status === "expiring");
    } else if (statusFilter !== "All Status") {
      result = result.filter((lease) => lease.status === statusFilter);
    }

    return result;
  }, [leases, statusFilter, viewExpiringOnly]);

  const columns: Column<Lease>[] = [
    {
      key: "leaseNumber",
      header: "Lease #",
      cell: (row) => <span className="font-semibold">{row.leaseNumber}</span>,
      sortable: true,
    },
    {
      key: "tenant",
      header: "Tenant",
      cell: (row) => row.tenant,
      sortable: true,
    },
    {
      key: "propertyName",
      header: "Property",
      cell: (row) => row.propertyName,
      sortable: true,
    },
    { key: "unit", header: "Unit", cell: (row) => row.unit, sortable: true },
    { key: "type", header: "Type", cell: (row) => row.type, sortable: true },
    {
      key: "baseRent",
      header: "Base Rent",
      cell: (row) => formatUSD(row.baseRent),
      sortable: true,
    },
    {
      key: "endDate",
      header: "End Date",
      cell: (row) => row.endDate,
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => leaseStatusBadge(row.status),
    },
  ];

  function openCreateModal() {
    setEditingLease(null);
    reset({
      ...defaultFormValues,
      propertyName: propertyOptions[0] ?? "",
      unit: unitOptions[0] ?? "",
    });
    setIsModalOpen(true);
  }

  function openEditModal(lease: Lease) {
    setEditingLease(lease);
    reset({
      tenant: lease.tenant,
      propertyName: lease.propertyName,
      unit: lease.unit,
      type: lease.type,
      baseRent: lease.baseRent,
      startDate: lease.startDate,
      endDate: lease.endDate,
      status: lease.status,
    });
    setIsModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setEditingLease(null);
      reset(defaultFormValues);
    }
  }

  function toggleViewExpiring() {
    setViewExpiringOnly((prev) => {
      const next = !prev;
      if (next) {
        setStatusFilter("All Status");
      }
      return next;
    });
  }

  async function onSubmit(values: LeaseFormData) {
    try {
      if (editingLease) {
        await updateLease({ id: editingLease.id, data: values }).unwrap();
        toast.success("Lease updated successfully");
      } else {
        await createLease(values).unwrap();
        toast.success("Lease added successfully");
      }
      handleModalChange(false);
    } catch {
      toast.error(editingLease ? "Failed to update lease" : "Failed to add lease");
    }
  }

  async function handleDelete(lease: Lease) {
    if (
      !window.confirm(
        `Delete lease "${lease.leaseNumber}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteLease(lease.id).unwrap();
      toast.success("Lease deleted successfully");
    } catch {
      toast.error("Failed to delete lease");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leases"
        description="Manage lease agreements and terms"
      >
        <Button
          variant="outline"
          onClick={toggleViewExpiring}
          className={cn(viewExpiringOnly && "border-orange-500 text-orange-600")}
        >
          View Expiring
        </Button>
        <Button onClick={openCreateModal}>
          <Plus className="mr-1 h-4 w-4" /> Add Lease
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchKeys={["leaseNumber", "tenant", "propertyName", "unit", "type"]}
        hideExportPrint
        onRowEdit={openEditModal}
        onRowDelete={handleDelete}
        toolbarExtra={
          <Select
            value={viewExpiringOnly ? "expiring" : statusFilter}
            onValueChange={(value) => {
              if (value === "expiring") {
                setViewExpiringOnly(true);
                setStatusFilter("All Status");
              } else {
                setViewExpiringOnly(false);
                setStatusFilter(value as (typeof STATUS_FILTER_OPTIONS)[number]);
              }
            }}
            disabled={viewExpiringOnly}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {STATUS_FILTER_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "All Status"
                    ? status
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        title={editingLease ? "Edit Lease" : "Add Lease"}
        description={
          editingLease
            ? "Update lease agreement details"
            : "Create a new lease agreement"
        }
        submitLabel={editingLease ? "Update" : "Save"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="lease-tenant">Tenant</Label>
            <Input
              id="lease-tenant"
              placeholder="e.g. Acme Corporation"
              {...register("tenant")}
            />
            {errors.tenant && (
              <p className="text-sm text-destructive">{errors.tenant.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lease-property">Property</Label>
            <Select
              value={propertyNameValue}
              onValueChange={(value) => {
                setValue("propertyName", value, { shouldValidate: true });
                const firstUnit = units.find((u) => u.propertyName === value)?.unit;
                if (firstUnit) {
                  setValue("unit", firstUnit, { shouldValidate: true });
                }
              }}
            >
              <SelectTrigger id="lease-property">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {propertyOptions.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyName && (
              <p className="text-sm text-destructive">
                {errors.propertyName.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lease-unit">Unit</Label>
            {unitOptions.length > 0 ? (
              <Select
                value={watch("unit")}
                onValueChange={(value) =>
                  setValue("unit", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="lease-unit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="lease-unit"
                placeholder="e.g. Suite 101"
                {...register("unit")}
              />
            )}
            {errors.unit && (
              <p className="text-sm text-destructive">{errors.unit.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lease-type">Type</Label>
            <Select
              value={typeValue}
              onValueChange={(value) =>
                setValue("type", value as LeaseType, { shouldValidate: true })
              }
            >
              <SelectTrigger id="lease-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {LEASE_TYPES.map((type) => (
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
            <Label htmlFor="lease-rent">Base Rent ($)</Label>
            <Input
              id="lease-rent"
              type="number"
              min={0}
              placeholder="e.g. 12000"
              {...register("baseRent")}
            />
            {errors.baseRent && (
              <p className="text-sm text-destructive">{errors.baseRent.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lease-start">Start Date</Label>
            <Input id="lease-start" type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lease-end">End Date</Label>
            <Input id="lease-end" type="date" {...register("endDate")} />
            {errors.endDate && (
              <p className="text-sm text-destructive">{errors.endDate.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="lease-status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setValue("status", value as LeaseStatus, { shouldValidate: true })
              }
            >
              <SelectTrigger id="lease-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
