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
  useCreatePropertyMutation,
  useDeletePropertyMutation,
  useGetPropertiesQuery,
  useUpdatePropertyMutation,
} from "@/services/moduleApis";
import { propertySchema, type PropertyFormData } from "@/schemas";
import { formatUSD } from "@/lib/utils";
import type { Property, PropertyType } from "@/types";

const PROPERTY_TYPES: PropertyType[] = ["Commercial", "Residential", "Industrial"];
const TYPE_FILTER_OPTIONS = ["All Types", ...PROPERTY_TYPES] as const;

const defaultFormValues: PropertyFormData = {
  name: "",
  code: "",
  type: "Commercial",
  location: "",
  status: "active",
  occupancy: 0,
  value: 0,
};

export default function PropertiesPage() {
  const { data = [], isLoading } = useGetPropertiesQuery();
  const [createProperty] = useCreatePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [typeFilter, setTypeFilter] = useState<(typeof TYPE_FILTER_OPTIONS)[number]>("All Types");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: defaultFormValues,
  });

  const typeValue = watch("type");
  const statusValue = watch("status");

  const filteredData = useMemo(() => {
    if (typeFilter === "All Types") return data;
    return data.filter((property) => property.type === typeFilter);
  }, [data, typeFilter]);

  const columns: Column<Property>[] = [
    {
      key: "name",
      header: "Property Name",
      cell: (row) => <span className="font-semibold">{row.name}</span>,
      sortable: true,
    },
    { key: "code", header: "Code", cell: (row) => row.code, sortable: true },
    { key: "type", header: "Type", cell: (row) => row.type, sortable: true },
    { key: "location", header: "Location", cell: (row) => row.location, sortable: true },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant={row.status === "active" ? "success" : "secondary"}
          className="rounded-full px-2.5 py-0.5 font-normal capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "occupancy",
      header: "Occupancy",
      cell: (row) => `${row.occupancy}%`,
      sortable: true,
    },
    {
      key: "value",
      header: "Value",
      cell: (row) => formatUSD(row.value),
      sortable: true,
    },
  ];

  function openCreateModal() {
    setEditingProperty(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  }

  function openEditModal(property: Property) {
    setEditingProperty(property);
    reset({
      name: property.name,
      code: property.code,
      type: property.type,
      location: property.location,
      status: property.status,
      occupancy: property.occupancy,
      value: property.value,
    });
    setIsModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setEditingProperty(null);
      reset(defaultFormValues);
    }
  }

  async function onSubmit(values: PropertyFormData) {
    try {
      if (editingProperty) {
        await updateProperty({ id: editingProperty.id, data: values }).unwrap();
        toast.success("Property updated successfully");
      } else {
        await createProperty(values).unwrap();
        toast.success("Property added successfully");
      }
      handleModalChange(false);
    } catch {
      toast.error(editingProperty ? "Failed to update property" : "Failed to add property");
    }
  }

  async function handleDelete(property: Property) {
    if (
      !window.confirm(
        `Delete "${property.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteProperty(property.id).unwrap();
      toast.success("Property deleted successfully");
    } catch {
      toast.error("Failed to delete property");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        description="Manage your real estate portfolio"
      >
        <Button onClick={openCreateModal}>
          <Plus className="mr-1 h-4 w-4" /> Add Property
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchKeys={["name", "code", "type", "location"]}
        hideExportPrint
        onRowEdit={openEditModal}
        onRowDelete={handleDelete}
        toolbarExtra={
          <Select
            value={typeFilter}
            onValueChange={(value) =>
              setTypeFilter(value as (typeof TYPE_FILTER_OPTIONS)[number])
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_FILTER_OPTIONS.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        title={editingProperty ? "Edit Property" : "Add Property"}
        description={
          editingProperty
            ? "Update property details in your portfolio"
            : "Add a new property to your portfolio"
        }
        submitLabel={editingProperty ? "Update" : "Save"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="property-name">Property Name</Label>
            <Input
              id="property-name"
              placeholder="e.g. Grand Plaza Corporate Center"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="property-code">Code</Label>
            <Input id="property-code" placeholder="e.g. PROP-GP" {...register("code")} />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="property-type">Type</Label>
            <Select
              value={typeValue}
              onValueChange={(value) =>
                setValue("type", value as PropertyType, { shouldValidate: true })
              }
            >
              <SelectTrigger id="property-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
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

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="property-location">Location</Label>
            <Input
              id="property-location"
              placeholder="e.g. Seattle, WA"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="property-status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setValue("status", value as PropertyFormData["status"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="property-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="property-occupancy">Occupancy (%)</Label>
            <Input
              id="property-occupancy"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 90"
              {...register("occupancy")}
            />
            {errors.occupancy && (
              <p className="text-sm text-destructive">{errors.occupancy.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="property-value">Value ($)</Label>
            <Input
              id="property-value"
              type="number"
              min={0}
              placeholder="e.g. 12500000"
              {...register("value")}
            />
            {errors.value && (
              <p className="text-sm text-destructive">{errors.value.message}</p>
            )}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
