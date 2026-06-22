"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types";
import { formatBDT } from "@/lib/utils";

interface KanbanBoardProps {
  columns: Record<string, Lead[]>;
  onMoveLead?: (leadId: string, newStage: Lead["stage"]) => void;
}

export function KanbanBoard({ columns, onMoveLead }: KanbanBoardProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (leadId: string) => setDraggedId(leadId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (stage: Lead["stage"]) => {
    if (draggedId && onMoveLead) {
      onMoveLead(draggedId, stage);
    }
    setDraggedId(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Object.entries(columns).map(([stage, leads]) => (
        <div
          key={stage}
          className="min-w-[280px] flex-shrink-0"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(stage as Lead["stage"])}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{stage}</h3>
            <Badge variant="secondary">{leads.length}</Badge>
          </div>
          <div className="space-y-3">
            {leads.map((lead) => (
              <Card
                key={lead.id}
                draggable
                onDragStart={() => handleDragStart(lead.id)}
                className={cn(
                  "cursor-grab active:cursor-grabbing",
                  draggedId === lead.id && "opacity-50"
                )}
              >
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-sm font-medium">{lead.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-1">
                  <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  <p className="text-xs">{lead.projectInterest}</p>
                  <p className="text-xs font-medium">{formatBDT(lead.budget)}</p>
                  <Badge variant="outline" className="text-[10px]">
                    {lead.source}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            {leads.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                Drop leads here
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
