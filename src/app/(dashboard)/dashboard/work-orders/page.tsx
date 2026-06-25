"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatUSD } from "@/lib/utils";
import { workOrderSchema, type WorkOrderFormData } from "@/schemas";
import {
  useCreateWorkOrderMutation,
  useDeleteWorkOrderMutation,
  useGetPropertiesQuery,
  useGetWorkOrdersQuery,
  useUpdateWorkOrderMutation,
} from "@/services/moduleApis";
import type { WorkOrder } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CATEGORIES = ["Hvac", "Plumbing", "Elevator", "Electrical"];
const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["open", "in progress", "completed", "scheduled"];

const defaultFormValues: WorkOrderFormData = {
  title: "",
  property: "",
  category: "Hvac",
  priority: "medium",
  status: "open",
  cost: 0,
};

export default function WorkOrdersPage() {
  const { data: workOrders = [], isLoading } = useGetWorkOrdersQuery();
  const { data: properties = [] } = useGetPropertiesQuery();

  const [createWorkOrder] = useCreateWorkOrderMutation();
  const [updateWorkOrder] = useUpdateWorkOrderMutation();
  const [deleteWorkOrder] = useDeleteWorkOrderMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priority");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkOrderFormData>({
    defaultValues: defaultFormValues,
  });

  const propertyValue = watch("property");
  const categoryValue = watch("category");
  const priorityValue = watch("priority");
  const statusValue = watch("status");

  // Get active properties for the dropdown selector
  const propertyOptions = useMemo(() => {
    if (properties.length > 0) {
      return properties.map((p) => p.name);
    }
    return [
      "Grand Plaza Corporate Center",
      "Oakridge Residential Towers",
      "Skyline Industrial Park",
    ];
  }, [properties]);

  // Statistics calculation
  const stats = useMemo(() => {
    const counts = {
      open: 0,
      inProgress: 0,
      completed: 0,
      scheduled: 0,
    };
    workOrders.forEach((wo) => {
      const status = wo.status.toLowerCase();
      if (status === "open") counts.open++;
      else if (status === "in progress" || status === "in_progress") counts.inProgress++;
      else if (status === "completed") counts.completed++;
      else if (status === "scheduled") counts.scheduled++;
    });
    return counts;
  }, [workOrders]);

  // Filtered work orders
  const filteredData = useMemo(() => {
    return workOrders.filter((wo) => {
      const matchesStatus =
        statusFilter === "All Status" ||
        wo.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority =
        priorityFilter === "All Priority" ||
        wo.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchesStatus && matchesPriority;
    });
  }, [workOrders, statusFilter, priorityFilter]);

  const columns: Column<WorkOrder>[] = [
    {
      key: "woNumber",
      header: "WO #",
      cell: (row) => <span className="font-semibold text-gray-700">{row.woNumber}</span>,
      sortable: true,
    },
    {
      key: "title",
      header: "Title",
      cell: (row) => <span>{row.title}</span>,
      sortable: true,
    },
    {
      key: "property",
      header: "Property",
      cell: (row) => <span>{row.property}</span>,
      sortable: true,
    },
    {
      key: "category",
      header: "Category",
      cell: (row) => <span>{row.category}</span>,
      sortable: true,
    },
    {
      key: "priority",
      header: "Priority",
      cell: (row) => {
        const priority = row.priority.toLowerCase();
        return (
          <Badge
            variant="secondary"
            className={cn(
              "rounded-full px-2.5 py-0.5 font-normal capitalize border",
              priority === "high" && "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
              priority === "medium" && "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",
              priority === "low" && "bg-slate-50 text-slate-600 border-slate-150 hover:bg-slate-50"
            )}
          >
            {row.priority}
          </Badge>
        );
      },
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const status = row.status.toLowerCase();
        let badgeClass = "rounded-full px-2.5 py-0.5 font-normal capitalize border ";

        if (status === "completed") {
          badgeClass += "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
        } else if (status === "in progress") {
          badgeClass += "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50";
        } else if (status === "scheduled") {
          badgeClass += "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-100";
        } else {
          // open
          badgeClass += "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50";
        }

        return (
          <Badge variant="secondary" className={badgeClass}>
            {row.status}
          </Badge>
        );
      },
      sortable: true,
    },
    {
      key: "cost",
      header: "Cost",
      cell: (row) => <span>{formatUSD(row.cost)}</span>,
      sortable: true,
    },
  ];

  function openCreateModal() {
    setEditingWorkOrder(null);
    reset(defaultFormValues);
    setIsModalOpen(true);
  }

  function openEditModal(wo: WorkOrder) {
    setEditingWorkOrder(wo);
    reset({
      title: wo.title,
      property: wo.property,
      category: wo.category,
      priority: wo.priority,
      status: wo.status,
      cost: wo.cost,
    });
    setIsModalOpen(true);
  }

  function handleModalChange(open: boolean) {
    setIsModalOpen(open);
    if (!open) {
      setEditingWorkOrder(null);
      reset(defaultFormValues);
    }
  }

  async function onSubmit(values: WorkOrderFormData) {
    try {
      if (editingWorkOrder) {
        await updateWorkOrder({ id: editingWorkOrder.id, data: values }).unwrap();
        toast.success("Work order updated successfully");
      } else {
        await createWorkOrder(values).unwrap();
        toast.success("Work order created successfully");
      }
      handleModalChange(false);
    } catch {
      toast.error(editingWorkOrder ? "Failed to update work order" : "Failed to create work order");
    }
  }

  async function handleDelete(wo: WorkOrder) {
    if (!window.confirm(`Delete "${wo.title}" (${wo.woNumber})? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteWorkOrder(wo.id).unwrap();
      toast.success("Work order deleted successfully");
    } catch {
      toast.error("Failed to delete work order");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Work Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Track maintenance and service requests</p>
        </div>
        <Button onClick={openCreateModal} className="bg-slate-950 text-white hover:bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-1 font-medium transition-colors">
          <Plus className="h-4 w-4" /> Add Work Order
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[110px] hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold tracking-tight text-slate-900">{stats.open}</p>
          <p className="text-sm text-slate-400 font-medium mt-1">Open</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[110px] hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold tracking-tight text-slate-900">{stats.inProgress}</p>
          <p className="text-sm text-slate-400 font-medium mt-1">In Progress</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[110px] hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold tracking-tight text-slate-900">{stats.completed}</p>
          <p className="text-sm text-slate-400 font-medium mt-1">Completed</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center min-h-[110px] hover:shadow-md transition-shadow">
          <p className="text-4xl font-extrabold tracking-tight text-slate-900">{stats.scheduled}</p>
          <p className="text-sm text-slate-400 font-medium mt-1">Scheduled</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchKeys={["title", "property", "category", "woNumber"]}
        hideExportPrint
        onRowEdit={openEditModal}
        onRowDelete={handleDelete}
        toolbarExtra={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white border-slate-200">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] bg-white border-slate-200">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="All Priority">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* Add / Edit Modal */}
      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={handleModalChange}
        title={editingWorkOrder ? "Edit Work Order" : "Add Work Order"}
        description={editingWorkOrder ? "Update details of the work order" : "Create a new work order task"}
        submitLabel={editingWorkOrder ? "Update" : "Save"}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="wo-title">Title</Label>
            <Input id="wo-title" placeholder="e.g. HVAC Maintenance" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          {/* Property Selector */}
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="wo-property">Property</Label>
            <Select value={propertyValue} onValueChange={(val) => setValue("property", val, { shouldValidate: true })}>
              <SelectTrigger id="wo-property">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {propertyOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.property && <p className="text-sm text-destructive">{errors.property.message}</p>}
          </div>

          {/* Category Selector */}
          <div className="grid gap-2">
            <Label htmlFor="wo-category">Category</Label>
            <Select value={categoryValue} onValueChange={(val) => setValue("category", val, { shouldValidate: true })}>
              <SelectTrigger id="wo-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          {/* Cost */}
          <div className="grid gap-2">
            <Label htmlFor="wo-cost">Cost ($)</Label>
            <Input id="wo-cost" type="number" min={0} placeholder="e.g. 450" {...register("cost")} />
            {errors.cost && <p className="text-sm text-destructive">{errors.cost.message}</p>}
          </div>

          {/* Priority */}
          <div className="grid gap-2">
            <Label htmlFor="wo-priority">Priority</Label>
            <Select value={priorityValue} onValueChange={(val) => setValue("priority", val as any, { shouldValidate: true })}>
              <SelectTrigger id="wo-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {PRIORITIES.map((pri) => (
                  <SelectItem key={pri} value={pri} className="capitalize">
                    {pri}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="wo-status">Status</Label>
            <Select value={statusValue} onValueChange={(val) => setValue("status", val as any, { shouldValidate: true })}>
              <SelectTrigger id="wo-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {STATUSES.map((st) => (
                  <SelectItem key={st} value={st} className="capitalize">
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
