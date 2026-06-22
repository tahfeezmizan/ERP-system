"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { KanbanBoard } from "@/components/shared/KanbanBoard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatBDT } from "@/lib/utils";
import { type CreateLeadFormData } from "@/schemas";
import {
  useCreateLeadMutation,
  useGetLeadsQuery,
  useGetPipelineQuery,
  useUpdateLeadStageMutation,
} from "@/services/moduleApis";
import type { Lead } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LEAD_SOURCES = ["Facebook", "Referral", "Walk-In", "Website", "Billboard", "TV", "Other"] as const;

export default function CrmPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: leads = [], isLoading, refetch } = useGetLeadsQuery();
  const { data: pipeline = {}, isLoading: pipelineLoading } = useGetPipelineQuery();
  const [updateStage] = useUpdateLeadStageMutation();
  const [createLead] = useCreateLeadMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateLeadFormData>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      source: "Walk-In",
      projectInterest: "",
      budget: undefined,
      assignedTo: "",
    },
  });

  const sourceValue = watch("source");

  const columns: Column<Lead>[] = [
    { key: "name", header: "Name", cell: (r) => r.name, sortable: true },
    { key: "phone", header: "Phone", cell: (r) => r.phone },
    { key: "source", header: "Source", cell: (r) => r.source },
    { key: "stage", header: "Stage", cell: (r) => <StatusBadge status={r.stage} /> },
    { key: "assignedTo", header: "Assigned To", cell: (r) => r.assignedTo },
    { key: "projectInterest", header: "Project", cell: (r) => r.projectInterest },
    { key: "budget", header: "Budget", cell: (r) => formatBDT(r.budget), sortable: true },
  ];

  const handleMoveLead = async (leadId: string, stage: Lead["stage"]) => {
    try {
      await updateStage({ id: leadId, stage }).unwrap();
      toast.success(`Lead moved to ${stage}`);
    } catch {
      toast.error("Failed to update lead stage");
    }
  };

  async function onSubmit(values: CreateLeadFormData) {
    try {
      await createLead(values).unwrap();
      toast.success("Lead added successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to add lead");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Sales CRM" description="Lead management and sales pipeline">
        <div className="flex gap-2">
          <Button variant={view === "kanban" ? "default" : "outline"} size="sm" onClick={() => setView("kanban")}>
            Kanban
          </Button>
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
            List
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> New Lead
          </Button>
        </div>
      </PageHeader>

      {view === "kanban" ? (
        pipelineLoading ? (
          <div className="h-64 animate-pulse bg-muted rounded-lg" />
        ) : (
          <KanbanBoard columns={pipeline} onMoveLead={handleMoveLead} />
        )
      ) : (
        <DataTable
          columns={columns}
          data={leads}
          isLoading={isLoading}
          searchKeys={["name", "phone", "projectInterest"]}
        />
      )}

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="New Lead"
        description="Add a new sales lead to the pipeline"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="lead-name">Full Name</Label>
            <Input id="lead-name" placeholder="e.g. Mohammad Hasan" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input id="lead-phone" placeholder="01XXXXXXXXX" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-source">Lead Source</Label>
            <Select value={sourceValue} onValueChange={(v) => setValue("source", v as CreateLeadFormData["source"])}>
              <SelectTrigger id="lead-source">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.source && <p className="text-sm text-destructive">{errors.source.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-assigned">Assigned To</Label>
            <Input id="lead-assigned" placeholder="e.g. Karim Ahmed" {...register("assignedTo")} />
            {errors.assignedTo && <p className="text-sm text-destructive">{errors.assignedTo.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="lead-project">Project Interest</Label>
            <Input id="lead-project" placeholder="e.g. Green Valley Residency" {...register("projectInterest")} />
            {errors.projectInterest && <p className="text-sm text-destructive">{errors.projectInterest.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-budget">Budget (৳)</Label>
            <Input id="lead-budget" type="number" placeholder="e.g. 8500000" {...register("budget")} />
            {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lead-email">Email (optional)</Label>
            <Input id="lead-email" type="email" placeholder="lead@email.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
