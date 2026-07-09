import { Badge } from "@/components/ui/badge";

const LABELS: Record<string, string> = {
  pending_payment: "Awaiting Deposit",
  deposit_paid: "Deposit Paid",
  confirmed: "Confirmed",
  detailer_assigned: "Detailer Assigned",
  en_route: "En Route",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const VARIANTS: Record<string, "default" | "gold" | "success" | "danger" | "outline"> = {
  pending_payment: "default",
  deposit_paid: "gold",
  confirmed: "gold",
  detailer_assigned: "gold",
  en_route: "gold",
  in_progress: "gold",
  completed: "success",
  cancelled: "danger",
};

export function BookingStatusBadge({ status }: { status: string }) {
  return <Badge variant={VARIANTS[status] ?? "default"}>{LABELS[status] ?? status}</Badge>;
}
