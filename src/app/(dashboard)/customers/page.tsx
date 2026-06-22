"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { useCreateCustomerMutation, useGetCustomersQuery } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";
import { createCustomerSchema, type CreateCustomerFormData } from "@/schemas/customer";
import { toast } from "sonner";
import type { Customer } from "@/types";

export default function CustomersPage() {
  const { data = [], isLoading, refetch } = useGetCustomersQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createCustomer] = useCreateCustomerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      nid: "",
      address: "",
    },
  });

  const columns: Column<Customer>[] = [
    { key: "name", header: "Name", cell: (r) => r.name, sortable: true },
    { key: "phone", header: "Phone", cell: (r) => r.phone },
    { key: "email", header: "Email", cell: (r) => r.email ?? "—" },
    { key: "nid", header: "NID", cell: (r) => r.nid },
    { key: "address", header: "Address", cell: (r) => r.address },
    { key: "totalPaid", header: "Paid", cell: (r) => formatBDT(r.totalPaid), sortable: true },
    { key: "totalDue", header: "Due", cell: (r) => formatBDT(r.totalDue), sortable: true },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  async function onSubmit(values: CreateCustomerFormData) {
    try {
      await createCustomer(values).unwrap();
      toast.success("Customer created successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch (error) {
      toast.error("Failed to create customer");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Customer profiles, KYC, ledger, and documents">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Customer
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "phone", "nid"]} />
      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Customer"
        description="Create a new customer profile"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nid">NID</Label>
            <Input id="nid" {...register("nid")} />
            {errors.nid && <p className="text-sm text-destructive">{errors.nid.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
