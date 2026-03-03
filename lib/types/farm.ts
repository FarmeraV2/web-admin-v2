import { User } from "./user";

export type FarmStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface Farm {
  id: string;
  name: string;
  description?: string;
  address: string;
  tax_number?: string;
  size?: number;
  established_year?: number;
  status: FarmStatus;
  owner: User;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface FarmApprovalRecord {
  id: string;
  farm_id: string;
  status: FarmStatus;
  reason?: string;
  reviewed_by?: string;
  created_at: string;
}
