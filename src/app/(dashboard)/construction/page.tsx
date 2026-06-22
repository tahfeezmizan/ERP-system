"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { ChartCard } from "@/components/charts/ChartCard";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetProgressQuery } from "@/services/moduleApis";

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Construction Management"
        description="BOQ, milestones, progress tracking, and site monitoring"
      />

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
    </div>
  );
}
