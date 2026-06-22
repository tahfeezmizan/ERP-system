"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetProjectsQuery } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";
import type { Project } from "@/types";

export default function ProjectsPage() {
  const { data = [], isLoading } = useGetProjectsQuery();

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

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Project development, approvals, and planning">
        <Button><Plus className="h-4 w-4 mr-1" /> New Project</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "code", "location"]} />
    </div>
  );
}
