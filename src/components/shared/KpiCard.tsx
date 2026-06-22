"use client";

import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { KpiMetric } from "@/types";

interface KpiCardProps {
  metric: KpiMetric;
  icon?: LucideIcon;
  className?: string;
}

export function KpiCard({ metric, icon: Icon, className }: KpiCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            <p className="text-2xl font-bold tracking-tight">{metric.value}</p>
            {metric.change !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : metric.trend === "down" ? (
                  <TrendingDown className="h-3 w-3 text-danger" />
                ) : null}
                <span
                  className={cn(
                    metric.trend === "up" && "text-success",
                    metric.trend === "down" && "text-danger",
                    metric.trend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
