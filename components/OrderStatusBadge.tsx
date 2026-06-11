import { OrderStatus } from "@/lib/db";

const styles: Record<OrderStatus, string> = {
  paid: "bg-aurora-500/15 text-aurora-400",
  pending: "bg-amber-400/15 text-amber-300",
  refunded: "bg-white/10 text-white/45",
  failed: "bg-red-400/15 text-red-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
