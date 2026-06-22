"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { KanbanBoard } from "@/components/shared/KanbanBoard";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetLeadsQuery, useGetPipelineQuery, useUpdateLeadStageMutation } from "@/services/moduleApis";
import { formatBDT } from "@/lib/utils";
import type { Lead } from "@/types";

export default function CrmPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const { data: leads = [], isLoading } = useGetLeadsQuery();
  const { data: pipeline = {}, isLoading: pipelineLoading } = useGetPipelineQuery();
  const [updateStage] = useUpdateLeadStageMutation();

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
          <Button><Plus className="h-4 w-4 mr-1" /> New Lead</Button>
        </div>
      </PageHeader>

      {view === "kanban" ? (
        pipelineLoading ? (
          <div className="h-64 animate-pulse bg-muted rounded-lg" />
        ) : (
          <KanbanBoard columns={pipeline} onMoveLead={handleMoveLead} />
        )
      ) : (
        <DataTable columns={columns} data={leads} isLoading={isLoading} searchKeys={["name", "phone", "projectInterest"]} />
      )}
    </div>
  );
}
