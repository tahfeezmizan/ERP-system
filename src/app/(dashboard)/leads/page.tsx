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
import { createLeadSchema, type CreateLeadFormData } from "@/schemas";
import {
  useCreateLeadMutation,
  useDeleteLeadMutation,
  useGetLeadsQuery,
  useUpdateLeadMutation,
} from "@/services/moduleApis";
import type { Lead } from "@/types";
import { formatUSD } from "@/lib/utils";

const LEAD_FILTER_OPTIONS = ["All Status", ...["Lead", "Interested", "Site Visit", "Negotiation", "Booking", "Agreement", "Registration", "Handover"]] as const;
const LEAD_TYPES = ["Commercial", "Residential"] as const;

const defaultFormValues: CreateLeadFormData = {
  name: "",
  company: "",
  phone: "",
  email: "",
  source: "Website",
  assignedTo: "",
  projectInterest: "",
  targetProperty: "",
  leadType: "Commercial",
  stage: "Lead",
  probability: 0,
  expectedCloseDate: "",
  budget: 0,
};

export default function LeadsPage() {
  const { data: leads = [], isLoading } = useGetLeadsQuery();
  const [createLead] = useCreateLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const [deleteLead] = useDeleteLeadMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [stageFilter, setStageFilter] = useState<(typeof LEAD_FILTER_OPTIONS)[number]>(
    "All Status",
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadFormData>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: defaultFormValues,
  });

  const stageValue = watch("stage");
  const leadTypeValue = watch("leadType");

  const filteredData = useMemo(() => {
    if (stageFilter === "All Status") return leads;
    return leads.filter((lead) => lead.stage === stageFilter);
  }, [leads, stageFilter]);

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Contact",
      cell: (row) => <span className="font-semibold">{row.name}</span>,
      sortable: true,
    },
    {
      key: "company",
      header: "Company",
      cell: (row) => row.company || "-",
      sortable: true,
    },
    {
      key: "leadType",
      header: "Type",
      cell: (row) => row.leadType,
      sortable: true,
    },
    {
      key: "source",
      header: "Source",
      cell: (row) => row.source,
      sortable: true,
    },
    {
      key: "budget",
      header: "Est. Value",
      cell: (row) => formatUSD(row.budget),
      sortable: true,
    },
    {
      key: "probability",
      header: "Probability",
      cell: (row) => `${row.probability}%`,
      sortable: true,
    },
    {
      key: "stage",
      header: "Status",
      cell: (row) => (
        <Badge
          variant={row.stage === "Lead" ? "secondary" : "outline"}
          className="rounded-full px-2.5 py-0.5 font-normal capitalize"
        >
          {row.stage.toLowerCase()}
        </Badge>
      ),
      sortable: true,
    },
  ];

  function openCreateModal() {
    setEditingLead(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  }

  function openEditModal(lead: Lead) {
    setEditingLead(lead);
    reset({
      name: lead.name,
      company: lead.company,
      phone: lead.phone,
      email: lead.email ?? "",
      source: lead.source,
      assignedTo: lead.assignedTo,
      projectInterest: lead.projectInterest,
      targetProperty: lead.targetProperty,
      leadType: lead.leadType,
      stage: lead.stage,
      probability: lead.probability,
      expectedCloseDate: lead.expectedCloseDate ?? "",
      budget: lead.budget,
    });
    setIsModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setEditingLead(null);
      reset(defaultFormValues);
    }
  }

  async function onSubmit(values: CreateLeadFormData) {
    try {
      if (editingLead) {
        await updateLead({ id: editingLead.id, data: values }).unwrap();
        toast.success("Lead updated successfully");
      } else {
        await createLead(values).unwrap();
        toast.success("Lead added successfully");
      }
      handleModalChange(false);
    } catch {
      toast.error(editingLead ? "Failed to update lead" : "Failed to add lead");
    }
  }

  async function handleDelete(lead: Lead) {
    if (!window.confirm(`Delete lead "${lead.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteLead(lead.id).unwrap();
      toast.success("Lead deleted successfully");
    } catch {
      toast.error("Failed to delete lead");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Leads / CRM" description="Sales pipeline and lead management">
        <Button onClick={openCreateModal}>
          <Plus className="mr-1 h-4 w-4" /> Add Lead
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchKeys={["name", "company", "source", "projectInterest", "assignedTo"]}
        hideExportPrint
        onRowEdit={openEditModal}
        onRowDelete={handleDelete}
        toolbarExtra={
          <Select
            value={stageFilter}
            onValueChange={(value) =>
              setStageFilter(value as (typeof LEAD_FILTER_OPTIONS)[number])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {LEAD_FILTER_OPTIONS.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        title={editingLead ? "Edit Lead" : "Add New Lead"}
        description={
          editingLead
            ? "Update lead details and sales pipeline status"
            : "Add a new sales lead to the CRM"
        }
        submitLabel={editingLead ? "Update Lead" : "Create Lead"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="lead-name">Contact Name</Label>
            <Input id="lead-name" placeholder="e.g. David Vance" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-company">Company Name</Label>
            <Input id="lead-company" placeholder="e.g. Vance Logistics" {...register("company")} />
            {errors.company && (
              <p className="text-sm text-destructive">{errors.company.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input id="lead-email" placeholder="e.g. david@vance.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-phone">Phone</Label>
            <Input id="lead-phone" placeholder="e.g. 01700-000000" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-targetProperty">Target Property</Label>
            <Input
              id="lead-targetProperty"
              placeholder="e.g. Grand Plaza Corporate Center"
              {...register("targetProperty")}
            />
            {errors.targetProperty && (
              <p className="text-sm text-destructive">{errors.targetProperty.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-type">Lead Type</Label>
            <Select
              value={leadTypeValue}
              onValueChange={(value) =>
                setValue("leadType", value as typeof leadTypeValue, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="lead-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leadType && (
              <p className="text-sm text-destructive">{errors.leadType.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-source">Source</Label>
            <Select
              value={watch("source")}
              onValueChange={(value) => setValue("source", value as any, { shouldValidate: true })}
            >
              <SelectTrigger id="lead-source">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Facebook",
                  "Website",
                  "Walk-In",
                  "Referral",
                  "Broker",
                  "Campaign",
                  "Exhibition",
                  "Phone Inquiry",
                  "Billboard",
                  "TV",
                  "Other",
                ].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.source && (
              <p className="text-sm text-destructive">{errors.source.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-stage">Pipeline Stage</Label>
            <Select
              value={stageValue}
              onValueChange={(value) => setValue("stage", value as typeof stageValue, { shouldValidate: true })}
            >
              <SelectTrigger id="lead-stage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_FILTER_OPTIONS.filter((value) => value !== "All Status").map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stage && (
              <p className="text-sm text-destructive">{errors.stage.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-budget">Est. Value ($)</Label>
            <Input
              id="lead-budget"
              type="number"
              step="1000"
              {...register("budget", { valueAsNumber: true })}
            />
            {errors.budget && (
              <p className="text-sm text-destructive">{errors.budget.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lead-probability">Probability (%)</Label>
            <Input
              id="lead-probability"
              type="number"
              min={0}
              max={100}
              {...register("probability", { valueAsNumber: true })}
            />
            {errors.probability && (
              <p className="text-sm text-destructive">{errors.probability.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="lead-assignedTo">Assigned To</Label>
            <Input
              id="lead-assignedTo"
              placeholder="e.g. Karim Ahmed"
              {...register("assignedTo")}
            />
            {errors.assignedTo && (
              <p className="text-sm text-destructive">{errors.assignedTo.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="lead-projectInterest">Project Interest</Label>
            <Input
              id="lead-projectInterest"
              placeholder="e.g. Skyline Tower"
              {...register("projectInterest")}
            />
            {errors.projectInterest && (
              <p className="text-sm text-destructive">{errors.projectInterest.message}</p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="lead-expectedCloseDate">Expected Close Date</Label>
            <Input
              id="lead-expectedCloseDate"
              type="date"
              {...register("expectedCloseDate")}
            />
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
