"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { useGetProjectsQuery, useCreateProjectMutation } from "@/services/moduleApis";
import { createProjectSchema, type CreateProjectFormData } from "@/schemas";
import { formatBDT } from "@/lib/utils";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const { data = [], isLoading, refetch } = useGetProjectsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createProject] = useCreateProjectMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      code: "",
      location: "",
      budget: undefined,
      startDate: "",
      endDate: "",
      rajukApproval: false,
    },
  });

  const columns: Column<Project>[] = [
    { key: "code", header: "Code", cell: (r) => r.code, sortable: true },
    { key: "name", header: "Project Name", cell: (r) => r.name, sortable: true },
    { key: "location", header: "Location", cell: (r) => r.location },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    { key: "budget", header: "Budget", cell: (r) => formatBDT(r.budget), sortable: true },
    { key: "rajuk", header: "RAJUK", cell: (r) => (r.rajukApproval ? "Approved" : "Pending") },
    {
      key: "progress",
      header: "Progress",
      cell: (r) => (
        <div className="flex items-center gap-2 min-w-[120px]">
          <Progress value={r.completionPercent} className="h-2" />
          <span className="text-xs">{r.completionPercent}%</span>
        </div>
      ),
    },
  ];

  async function onSubmit(values: CreateProjectFormData) {
    try {
      await createProject(values).unwrap();
      toast.success("Project created successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to create project");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Project development, approvals, and planning">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Project
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "code", "location"]} />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="New Project"
        description="Create a new real-estate development project"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="proj-name">Project Name</Label>
            <Input id="proj-name" placeholder="e.g. Skyline Tower" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proj-code">Project Code</Label>
            <Input id="proj-code" placeholder="e.g. SKT-003" {...register("code")} />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="proj-location">Location</Label>
            <Input id="proj-location" placeholder="e.g. Banani, Dhaka" {...register("location")} />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="proj-budget">Total Budget (৳)</Label>
            <Input id="proj-budget" type="number" placeholder="e.g. 1200000000" {...register("budget")} />
            {errors.budget && <p className="text-sm text-destructive">{errors.budget.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proj-start">Start Date</Label>
            <Input id="proj-start" type="date" {...register("startDate")} />
            {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proj-end">Expected End Date</Label>
            <Input id="proj-end" type="date" {...register("endDate")} />
            {errors.endDate && <p className="text-sm text-destructive">{errors.endDate.message}</p>}
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <input id="proj-rajuk" type="checkbox" className="h-4 w-4 accent-primary" {...register("rajukApproval")} />
            <Label htmlFor="proj-rajuk" className="cursor-pointer">RAJUK Approval Obtained</Label>
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
