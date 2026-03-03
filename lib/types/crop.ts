import { Farm } from "./farm";

export type StepType = "PREPARATION" | "PLANTING" | "CARE" | "HARVEST" | "POST_HARVEST";

export interface Step {
  id: string;
  name: string;
  type: StepType;
  description?: string;
  order: number;
  min_logs: number;
  is_optional: boolean;
  intervals?: number;
  created_at: string;
}

export interface Season {
  id: string;
  name: string;
  crop_type: string;
  start_date: string;
  expected_end_date?: string;
  status: string;
  farm: Farm;
}

export interface Log {
  id: string;
  description: string;
  notes?: string;
  images: string[];
  videos: string[];
  gps_lat?: number;
  gps_lng?: number;
  blockchain_hash?: string;
  created_at: string;
}

export interface VerificationRequest {
  id: string;
  step: Step;
  season: Season;
  logs: Log[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  submitted_at: string;
  reviewed_at?: string;
  reason?: string;
}
