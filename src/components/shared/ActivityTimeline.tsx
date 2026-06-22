"use client";

import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "@/types";
import { cn } from "@/lib/utils";

interface ActivityTimelineProps {
  activities: ActivityItem[];
  className?: string;
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
            {index < activities.length - 1 && (
              <div className="w-px flex-1 bg-border min-h-[2rem]" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {activity.user} ·{" "}
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
