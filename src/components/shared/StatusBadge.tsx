import { Badge } from "@/components/ui/badge";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "success" | "warning" | "danger" | "outline"> = {
  Available: "success",
  Active: "success",
  Approved: "success",
  Received: "success",
  Verified: "success",
  Completed: "success",
  Acquired: "success",
  Reserved: "warning",
  Pending: "warning",
  "In Progress": "warning",
  Booked: "secondary",
  Open: "danger",
  Cancelled: "danger",
  Bounced: "danger",
  Sold: "default",
  Planning: "outline",
  Construction: "secondary",
  Sales: "success",
  Negotiation: "warning",
  Lead: "outline",
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status] ?? "outline";
  return <Badge variant={variant}>{status}</Badge>;
}
