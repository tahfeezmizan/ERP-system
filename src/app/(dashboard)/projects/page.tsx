"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createProjectSchema, type CreateProjectFormData } from "@/schemas";
import {
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useGetPropertiesQuery,
    useGetProjectsQuery,
    useUpdateProjectMutation,
} from "@/services/moduleApis";
import type { Project } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const STATUS_FILTER_OPTIONS = [
  "All Status",
  "Planning",
  "Approved",
  "Construction",
  "Sales",
  "Completed",
] as const;

const defaultFormValues: CreateProjectFormData = {
  name: "",
  code: "",
  location: "",
  propertyName: "",
  projectType: "",
  landArea: undefined,
  budget: 0,
  actualCost: undefined,
  availableUnits: undefined,
  soldUnits: undefined,
  reservedUnits: undefined,
  collectionAmount: undefined,
  dueAmount: undefined,
  startDate: "",
  endDate: "",
  expectedCompletion: "",
  completionPercent: 0,
  status: "Planning",
  rajukApproval: false,
  projectManager: "",
};

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTER_OPTIONS)[number]>("All Status");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema) as Resolver<CreateProjectFormData>,
    defaultValues: defaultFormValues,
  });

  const statusValue = watch("status");
  const propertyNameValue = watch("propertyName");

  const filteredData = useMemo(() => {
    if (statusFilter === "All Status") return projects;
    return projects.filter((project) => project.status === statusFilter);
  }, [projects, statusFilter]);

  const columns: Column<Project>[] = [
    {
      key: "code",
      header: "Code",
      cell: (row) => <span className="font-semibold">{row.code}</span>,
      sortable: true,
    },
    {
      key: "name",
      header: "Project Name",
      cell: (row) => row.name,
      sortable: true,
    },
    {
      key: "location",
      header: "Location",
      cell: (row) => row.location,
      sortable: true,
    },
    {
      key: "projectType",
      header: "Type",
      cell: (row) => row.projectType ?? "-",
      sortable: true,
    },
    {
      key: "budget",
      header: "Budget",
      cell: (row) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(row.budget),
      sortable: true,
    },
    {
      key: "spent",
      header: "Spent",
      cell: (row) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(row.spent),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge
          variant={
            row.status === "Planning"
              ? "secondary"
              : row.status === "Approved"
              ? "success"
              : row.status === "Construction"
              ? "warning"
              : row.status === "Sales"
              ? "outline"
              : "secondary"
          }
          className="rounded-full px-2.5 py-0.5 font-normal capitalize"
        >
          {row.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: "completionPercent",
      header: "Progress",
      cell: (row) => (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">{row.completionPercent}%</div>
          <Progress value={row.completionPercent} />
        </div>
      ),
    },
  ];

  function openCreateModal() {
    setEditingProject(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    reset({
      name: project.name,
      code: project.code,
      location: project.location,
      propertyName: project.propertyName ?? "",
      projectType: project.projectType,
      landArea: project.landArea,
      budget: project.budget,
      actualCost: project.spent,
      availableUnits: project.availableUnits,
      soldUnits: project.soldUnits,
      reservedUnits: project.reservedUnits,
      collectionAmount: project.collectionAmount,
      dueAmount: project.dueAmount,
      startDate: project.startDate,
      endDate: project.endDate,
      expectedCompletion: project.expectedCompletion,
      completionPercent: project.completionPercent,
      status: project.status,
      rajukApproval: project.rajukApproval,
      projectManager: project.projectManager,
    });
    setIsModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setEditingProject(null);
      reset(defaultFormValues);
    }
  }

  async function onSubmit(values: CreateProjectFormData) {
    try {
      if (editingProject) {
        await updateProject({ id: editingProject.id, data: values }).unwrap();
        toast.success("Project updated successfully");
      } else {
        await createProject(values).unwrap();
        toast.success("Project added successfully");
      }
      handleModalChange(false);
    } catch {
      toast.error(
        editingProject ? "Failed to update project" : "Failed to add project",
      );
    }
  }

  async function handleDelete(project: Project) {
    if (
      !window.confirm(
        `Delete project "${project.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteProject(project.id).unwrap();
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    }
  }

  const { data: properties = [] } = useGetPropertiesQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Construction and development management"
      >
        <Button onClick={openCreateModal}>
          <Plus className="mr-1 h-4 w-4" /> Add Project
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchKeys={["code", "name", "location", "projectType"]}
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
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        title={editingProject ? "Edit Project" : "Add Project"}
        description={
          editingProject
            ? "Update project details and budget information"
            : "Add a new project for construction and development management"
        }
        submitLabel={editingProject ? "Update Project" : "Add Project"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="e.g. Roof Replacement"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-code">Project Code</Label>
            <Input
              id="project-code"
              placeholder="e.g. PRJ-ROOF"
              {...register("code")}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-location">Location</Label>
            <Input
              id="project-location"
              placeholder="e.g. Grand Plaza Corporate Center"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-property">Associated Property</Label>
            <Select
              value={propertyNameValue}
              onValueChange={(value) =>
                setValue("propertyName", value, { shouldValidate: true })
              }
            >
              <SelectTrigger id="project-property">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.name}>
                    {property.name}
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
            <Label htmlFor="project-type">Type</Label>
            <Input
              id="project-type"
              placeholder="e.g. Renovation"
              {...register("projectType")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-budget">Total Budget</Label>
            <Input
              id="project-budget"
              type="number"
              step="1000"
              {...register("budget", { valueAsNumber: true })}
            />
            {errors.budget && (
              <p className="text-sm text-destructive">
                {errors.budget.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-actualCost">Spent To Date</Label>
            <Input
              id="project-actualCost"
              type="number"
              step="1000"
              {...register("actualCost", { valueAsNumber: true })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-startDate">Start Date</Label>
            <Input
              id="project-startDate"
              type="date"
              {...register("startDate")}
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-endDate">End Date</Label>
            <Input id="project-endDate" type="date" {...register("endDate")} />
            {errors.endDate && (
              <p className="text-sm text-destructive">
                {errors.endDate.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-manager">Project Manager</Label>
            <Input id="project-manager" {...register("projectManager")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-expectedCompletion">Target Completion</Label>
            <Input
              id="project-expectedCompletion"
              type="date"
              {...register("expectedCompletion")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-completionPercent">Progress (%)</Label>
            <Input
              id="project-completionPercent"
              type="number"
              min={0}
              max={100}
              step={1}
              {...register("completionPercent", { valueAsNumber: true })}
            />
            {errors.completionPercent && (
              <p className="text-sm text-destructive">
                {errors.completionPercent.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(value) =>
                setValue("status", value as typeof statusValue, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="project-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.filter((status) => status !== "All Status").map(
                  (status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="project-notes">Notes</Label>
            <Input
              id="project-notes"
              placeholder="Add any additional details..."
              {...register("landArea")}
            />
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
