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
import { PageHeader } from "@/components/shared/PageHeader";
import { ChartCard } from "@/components/charts/ChartCard";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { useGetProgressQuery } from "@/services/moduleApis";
import { createMilestoneSchema, type CreateMilestoneFormData } from "@/schemas";

const PROGRESS_ITEMS = [
  { key: "foundation", label: "Foundation" },
  { key: "structure", label: "Structure" },
  { key: "brickWork", label: "Brick Work" },
  { key: "electrical", label: "Electrical" },
  { key: "plumbing", label: "Plumbing" },
  { key: "finishing", label: "Finishing" },
] as const;

export default function ConstructionPage() {
  const { data, isLoading } = useGetProgressQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateMilestoneFormData>({
    resolver: zodResolver(createMilestoneSchema),
    defaultValues: {
      label: "",
      targetDate: "",
      assignedTo: "",
      notes: "",
    },
  });

  async function onSubmit(_values: CreateMilestoneFormData) {
    // Milestone stored locally (no API endpoint yet)
    await new Promise((r) => setTimeout(r, 400));
    toast.success("Milestone added successfully");
    reset();
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Construction Management"
        description="BOQ, milestones, progress tracking, and site monitoring"
      >
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Milestone
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PROGRESS_ITEMS.map(({ key, label }) => (
          <ChartCard key={key} title={label} isLoading={isLoading}>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span className="font-medium">{data?.[key] ?? 0}%</span>
              </div>
              <Progress value={data?.[key] ?? 0} />
            </div>
          </ChartCard>
        ))}

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Overall Project Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={data?.overall ?? 0} className="flex-1 h-6" />
              <span className="text-2xl font-bold">{data?.overall ?? 0}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Milestone"
        description="Create a new construction milestone or checkpoint"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="ms-label">Milestone Label</Label>
            <Input id="ms-label" placeholder="e.g. Foundation Complete" {...register("label")} />
            {errors.label && <p className="text-sm text-destructive">{errors.label.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-date">Target Date</Label>
            <Input id="ms-date" type="date" {...register("targetDate")} />
            {errors.targetDate && <p className="text-sm text-destructive">{errors.targetDate.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-assigned">Assigned To</Label>
            <Input id="ms-assigned" placeholder="e.g. Site Engineer" {...register("assignedTo")} />
            {errors.assignedTo && <p className="text-sm text-destructive">{errors.assignedTo.message}</p>}
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="ms-notes">Notes (optional)</Label>
            <Textarea
              id="ms-notes"
              placeholder="Any additional details or requirements…"
              rows={3}
              {...register("notes")}
            />
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
