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
  useCreateVendorMutation,
  useDeleteVendorMutation,
  useGetVendorsQuery,
  useUpdateVendorMutation,
} from "@/services/moduleApis";
import { vendorSchema, type VendorFormData } from "@/schemas";
import type { Vendor, VendorStatus } from "@/types";

const STATUS_FILTER_OPTIONS = ["All Status", "active", "inactive"] as const;
const defaultFormValues: VendorFormData = {
  company: "",
  contact: "",
  email: "",
  phone: "",
  type: "",
  rating: 5,
  status: "active",
};

export default function VendorsPage() {
  const { data: vendors = [], isLoading } = useGetVendorsQuery();
  const [createVendor] = useCreateVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();
  const [deleteVendor] = useDeleteVendorMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTER_OPTIONS)[number]>("All Status");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VendorFormData>({
    defaultValues: defaultFormValues,
  });

  const statusValue = watch("status");

  const filteredData = useMemo(() => {
    if (statusFilter === "All Status") return vendors;
    return vendors.filter((vendor) => vendor.status === statusFilter);
  }, [vendors, statusFilter]);

  const columns: Column<Vendor>[] = [
    {
      key: "company",
      header: "Company",
      cell: (row) => <span className="font-semibold">{row.company}</span>,
      sortable: true,
    },
    {
      key: "contact",
      header: "Contact",
      cell: (row) => row.contact,
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => row.email,
      sortable: true,
    },
    {
      key: "phone",
      header: "Phone",
      cell: (row) => row.phone,
      sortable: true,
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => row.type,
      sortable: true,
    },
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
      key: "rating",
      header: "Rating",
      cell: (row) => row.rating.toFixed(1),
      sortable: true,
    },
  ];

  function openCreateModal() {
    setEditingVendor(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  }

  function openEditModal(vendor: Vendor) {
    setEditingVendor(vendor);
    reset({
      company: vendor.company,
      contact: vendor.contact,
      email: vendor.email,
      phone: vendor.phone,
      type: vendor.type,
      rating: vendor.rating,
      status: vendor.status,
    });
    setIsModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setEditingVendor(null);
      reset(defaultFormValues);
    }
  }

  async function onSubmit(values: VendorFormData) {
    try {
      if (editingVendor) {
        await updateVendor({ id: editingVendor.id, data: values }).unwrap();
        toast.success("Vendor updated successfully");
      } else {
        await createVendor(values).unwrap();
        toast.success("Vendor added successfully");
      }
      handleModalChange(false);
    } catch {
      toast.error(
        editingVendor ? "Failed to update vendor" : "Failed to add vendor",
      );
    }
  }

  async function handleDelete(vendor: Vendor) {
    if (
      !window.confirm(
        `Delete "${vendor.company}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteVendor(vendor.id).unwrap();
      toast.success("Vendor deleted successfully");
    } catch {
      toast.error("Failed to delete vendor");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Manage vendors and service providers"
      >
        <Button onClick={openCreateModal}>
          <Plus className="mr-1 h-4 w-4" /> Add Vendor
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchKeys={["company", "contact", "email", "phone", "type"]}
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
        title={editingVendor ? "Edit Vendor" : "Add New Vendor"}
        description={
          editingVendor
            ? "Update vendor details and contact information"
            : "Add a new vendor or service provider"
        }
        submitLabel={editingVendor ? "Update Vendor" : "Create Vendor"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="vendor-company">Company Name</Label>
            <Input
              id="vendor-company"
              placeholder="e.g. Apex HVAC Services"
              {...register("company")}
            />
            {errors.company && (
              <p className="text-sm text-destructive">
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="vendor-contact">Contact Person</Label>
            <Input
              id="vendor-contact"
              placeholder="e.g. Mark Miller"
              {...register("contact")}
            />
            {errors.contact && (
              <p className="text-sm text-destructive">
                {errors.contact.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="vendor-email">Email</Label>
            <Input
              id="vendor-email"
              placeholder="e.g. mark@apexhvac.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="vendor-phone">Phone</Label>
            <Input
              id="vendor-phone"
              placeholder="e.g. 206-555-0201"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="vendor-type">Type</Label>
            <Input
              id="vendor-type"
              placeholder="e.g. HVAC"
              {...register("type")}
            />
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="vendor-rating">Rating (1-5)</Label>
            <Input
              id="vendor-rating"
              type="number"
              step="0.1"
              min={1}
              max={5}
              placeholder="5.0"
              {...register("rating", { valueAsNumber: true })}
            />
            {errors.rating && (
              <p className="text-sm text-destructive">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="vendor-status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setValue("status", value as VendorStatus, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="vendor-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
