"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
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
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
} from "@/services/moduleApis";
import { createProjectSchema, type CreateProjectFormData } from "@/schemas";
import { formatBDT } from "@/lib/utils";
import { Project } from "./model";

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
    resolver: zodResolver(createProjectSchema) as any,
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
    {
      key: "name",
      header: "Project Name",
      cell: (r) => r.name,
      sortable: true,
    },
    { key: "projectType", header: "Type", cell: (r) => r.projectType || "-" },
    { key: "location", header: "Location", cell: (r) => r.location },
    { key: "landArea", header: "Land Area", cell: (r) => r.landArea ?? "-" },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "budget",
      header: "Budget",
      cell: (r) => formatBDT(r.budget),
      sortable: true,
    },
    { key: "spent", header: "Actual Cost", cell: (r) => formatBDT(r.spent) },
    {
      key: "rajuk",
      header: "RAJUK",
      cell: (r) => (r.rajukApproval ? "Approved" : "Pending"),
    },
    {
      key: "completionPercent",
      header: "Progress",
      cell: (r) => `${r.completionPercent}%`,
      sortable: true,
    },
    {
      key: "availableUnits",
      header: "Available",
      cell: (r) => r.availableUnits ?? 0,
    },
    { key: "soldUnits", header: "Sold", cell: (r) => r.soldUnits ?? 0 },
    {
      key: "reservedUnits",
      header: "Reserved",
      cell: (r) => r.reservedUnits ?? 0,
    },
    {
      key: "collectionAmount",
      header: "Collection",
      cell: (r) => formatBDT(r.collectionAmount ?? 0),
    },
    {
      key: "dueAmount",
      header: "Due",
      cell: (r) => formatBDT(r.dueAmount ?? 0),
    },
    {
      key: "expectedCompletion",
      header: "Expected Completion",
      cell: (r) => r.expectedCompletion ?? "-",
    },
    {
      key: "projectManager",
      header: "Project Manager",
      cell: (r) => r.projectManager ?? "-",
    },
    {
      key: "createdAt",
      header: "Created Date",
      cell: (r) => r.createdAt ?? "-",
    },
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
      <PageHeader
        title="Projects"
        description="Project development, approvals, and planning"
      >
        <Link href="/projects/create-project">
          <Button>
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        </Link>
      </PageHeader>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchKeys={["name", "code", "location"]}
      />
    </div>
  );
}
