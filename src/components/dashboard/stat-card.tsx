import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName: string;
  iconBgClassName: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  iconBgClassName,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5 py-8">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>

        <div className={cn("rounded-lg p-2.5", iconBgClassName)}>
          <Icon className={cn("h-5 w-5", iconClassName)} />
        </div>
      </CardContent>
    </Card>
  );
}
