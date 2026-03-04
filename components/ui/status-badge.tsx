import { Badge } from "./badge";
import type {
  FarmStatus,
  CertificateStatus,
  ProductStatus,
  OrderStatus,
  UserStatus,
} from "@/lib/types";

type AnyStatus =
  | FarmStatus
  | CertificateStatus
  | ProductStatus
  | OrderStatus
  | UserStatus
  | string;

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "error" | "info" | "neutral" }> = {
  // Farm
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "error" },
  PENDING: { label: "Pending", variant: "warning" },
  PENDING_APPROVE: { label: "Pending Approval", variant: "warning" },
  SUSPENDED: { label: "Suspended", variant: "warning" },
  BLOCKED: { label: "Blocked", variant: "error" },
  UNSPECIFIED: { label: "Unspecified", variant: "neutral" },
  // Farm / Certificate
  VERIFIED: { label: "Verified", variant: "success" },
  EXPIRED: { label: "Expired", variant: "neutral" },
  // Product
  OPEN: { label: "Open", variant: "success" },
  CLOSED: { label: "Closed", variant: "neutral" },
  NOT_YET_OPEN: { label: "Not Open", variant: "info" },
  OUT_OF_STOCK: { label: "Out of Stock", variant: "warning" },
  // Order
  PENDING_CONFIRMATION: { label: "Pending", variant: "warning" },
  CONFIRMED: { label: "Confirmed", variant: "info" },
  PROCESSING: { label: "Processing", variant: "info" },
  SHIPPED: { label: "Shipped", variant: "info" },
  DELIVERED: { label: "Delivered", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "error" },
  // User
  ACTIVE: { label: "Active", variant: "success" },
  BANNED: { label: "Banned", variant: "error" },
};

interface StatusBadgeProps {
  status: AnyStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const entry = STATUS_MAP[status] ?? { label: status, variant: "neutral" as const };
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
