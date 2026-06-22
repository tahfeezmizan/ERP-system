"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { useGetComplaintsQuery, useCreateComplaintMutation } from "@/services/moduleApis";
import { createComplaintSchema, type CreateComplaintFormData } from "@/schemas";

type Complaint = {
  id: string;
  ticketNo: string;
  customer: string;
  unit: string;
  issue: string;
  status: string;
  priority: string;
};

const PRIORITIES = ["Low", "Medium", "High"] as const;

export default function MaintenancePage() {
  const { data = [], isLoading, refetch } = useGetComplaintsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createComplaint] = useCreateComplaintMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateComplaintFormData>({
    resolver: zodResolver(createComplaintSchema),
    defaultValues: {
      customer: "",
      unit: "",
      issue: "",
      priority: "Medium",
    },
  });

  const priorityValue = watch("priority");

  const columns: Column<Complaint>[] = [
    { key: "ticketNo", header: "Ticket", cell: (r) => r.ticketNo, sortable: true },
    { key: "customer", header: "Customer", cell: (r) => r.customer, sortable: true },
    { key: "unit", header: "Unit", cell: (r) => r.unit },
    { key: "issue", header: "Issue", cell: (r) => r.issue },
    { key: "priority", header: "Priority", cell: (r) => <StatusBadge status={r.priority} /> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  async function onSubmit(values: CreateComplaintFormData) {
    try {
      await createComplaint(values).unwrap();
      toast.success("Support ticket created successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to create ticket");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service & Maintenance"
        description="Complaints, tickets, warranty, and AMC management"
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Ticket
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchKeys={["ticketNo", "customer", "issue"]}
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="New Support Ticket"
        description="Log a maintenance complaint or service request"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="tkt-customer">Customer Name</Label>
            <Input id="tkt-customer" placeholder="e.g. Mohammad Hasan" {...register("customer")} />
            {errors.customer && <p className="text-sm text-destructive">{errors.customer.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tkt-unit">Unit Number</Label>
            <Input id="tkt-unit" placeholder="e.g. A-802" {...register("unit")} />
            {errors.unit && <p className="text-sm text-destructive">{errors.unit.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="tkt-priority">Priority</Label>
            <Select
              value={priorityValue}
              onValueChange={(v) => setValue("priority", v as CreateComplaintFormData["priority"])}
            >
              <SelectTrigger id="tkt-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="tkt-issue">Issue Description</Label>
            <Textarea
              id="tkt-issue"
              placeholder="Describe the issue in detail…"
              rows={3}
              {...register("issue")}
            />
            {errors.issue && <p className="text-sm text-destructive">{errors.issue.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
