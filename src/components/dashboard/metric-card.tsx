import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBgClassName: string;
  progress?: number;
  alert?: {
    text: string;
    variant: "warning" | "danger";
    direction: "up" | "down";
  };
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
  iconBgClassName,
  progress,
  alert,
}: MetricCardProps) {
  const AlertIcon = alert?.direction === "up" ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardContent className="p-5 py-8">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className={cn("shrink-0 rounded-lg p-2.5", iconBgClassName)}>
            <Icon className={cn("h-5 w-5", iconClassName)} />
          </div>
        </div>

        {progress !== undefined && (
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-foreground transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {alert && (
          <div
            className={cn(
              "mt-3 flex items-center gap-1 text-xs font-medium",
              alert.variant === "warning" && "text-warning",
              alert.variant === "danger" && "text-danger",
            )}
          >
            <AlertIcon className="h-3.5 w-3.5" />
            <span>{alert.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
