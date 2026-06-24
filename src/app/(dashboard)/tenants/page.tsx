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
  useCreateTenantMutation,
  useDeleteTenantMutation,
  useGetTenantsQuery,
  useUpdateTenantMutation,
} from "@/services/moduleApis";
import { tenantSchema, type TenantFormData } from "@/schemas";
import type { Tenant, TenantStatus, TenantType } from "@/types";

const TENANT_TYPES: TenantType[] = ["Commercial", "Residential"];
const STATUS_FILTER_OPTIONS = ["All Status", "active", "inactive"] as const;

const defaultFormValues: TenantFormData = {
  company: "",
  contact: "",
  email: "",
  phone: "",
  type: "Commercial",
  credit: 700,
  status: "active",
};

export default function TenantsPage() {
  const { data: tenants = [], isLoading } = useGetTenantsQuery();
  const [createTenant] = useCreateTenantMutation();
  const [updateTenant] = useUpdateTenantMutation();
  const [deleteTenant] = useDeleteTenantMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTER_OPTIONS)[number]>("All Status");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: defaultFormValues,
  });

  const typeValue = watch("type");
  const statusValue = watch("status");

  const filteredData = useMemo(() => {
    if (statusFilter === "All Status") return tenants;
    return tenants.filter((tenant) => tenant.status === statusFilter);
  }, [tenants, statusFilter]);

  const columns: Column<Tenant>[] = [
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
    { key: "type", header: "Type", cell: (row) => row.type, sortable: true },
    {
      key: "credit",
      header: "Credit",
      cell: (row) => row.credit,
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
  ];

  function openCreateModal() {
    setEditingTenant(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  }

  function openEditModal(tenant: Tenant) {
    setEditingTenant(tenant);
    reset({
      company: tenant.company,
      contact: tenant.contact,
      email: tenant.email,
      phone: tenant.phone,
      type: tenant.type,
      credit: tenant.credit,
      status: tenant.status,
    });
    setIsModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setEditingTenant(null);
      reset(defaultFormValues);
    }
  }

  async function onSubmit(values: TenantFormData) {
    try {
      if (editingTenant) {
        await updateTenant({ id: editingTenant.id, data: values }).unwrap();
        toast.success("Tenant updated successfully");
      } else {
        await createTenant(values).unwrap();
        toast.success("Tenant added successfully");
      }
      handleModalChange(false);
    } catch {
      toast.error(editingTenant ? "Failed to update tenant" : "Failed to add tenant");
    }
  }

  async function handleDelete(tenant: Tenant) {
    if (
      !window.confirm(
        `Delete tenant "${tenant.company}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteTenant(tenant.id).unwrap();
      toast.success("Tenant deleted successfully");
    } catch {
      toast.error("Failed to delete tenant");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenants"
        description="Manage tenant profiles and contacts"
      >
        <Button onClick={openCreateModal}>
          <Plus className="mr-1 h-4 w-4" /> Add Tenant
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
            <SelectContent>
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
        title={editingTenant ? "Edit Tenant" : "Add Tenant"}
        description={
          editingTenant
            ? "Update tenant profile and contact details"
            : "Add a new tenant to your portfolio"
        }
        submitLabel={editingTenant ? "Update" : "Save"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="tenant-company">Company</Label>
            <Input
              id="tenant-company"
              placeholder="e.g. Acme Corporation"
              {...register("company")}
            />
            {errors.company && (
              <p className="text-sm text-destructive">{errors.company.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tenant-contact">Contact</Label>
            <Input
              id="tenant-contact"
              placeholder="e.g. Sarah Johnson"
              {...register("contact")}
            />
            {errors.contact && (
              <p className="text-sm text-destructive">{errors.contact.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tenant-phone">Phone</Label>
            <Input
              id="tenant-phone"
              placeholder="e.g. 206-555-0101"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="tenant-email">Email</Label>
            <Input
              id="tenant-email"
              type="email"
              placeholder="e.g. sarah.johnson@acme.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tenant-type">Type</Label>
            <Select
              value={typeValue}
              onValueChange={(value) =>
                setValue("type", value as TenantType, { shouldValidate: true })
              }
            >
              <SelectTrigger id="tenant-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TENANT_TYPES.map((type) => (
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
            <Label htmlFor="tenant-credit">Credit Score</Label>
            <Input
              id="tenant-credit"
              type="number"
              min={300}
              max={850}
              placeholder="e.g. 750"
              {...register("credit")}
            />
            {errors.credit && (
              <p className="text-sm text-destructive">{errors.credit.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="tenant-status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setValue("status", value as TenantStatus, { shouldValidate: true })
              }
            >
              <SelectTrigger id="tenant-status">
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
        </div>
      </EntityCreateModal>
    </div>
  );
}
