export type CropType = "SHORT_TERM" | "LONG_TERM";

export interface Crop {
  id: number;
  name: string;
  crop_type: CropType;
  image_url: string | null;
  description: string | null;
  max_seasons: number | null;
}

// Actual step type values from backend StepType enum
export type StepType = "PREPARE" | "PLANTING" | "CARE" | "HARVEST" | "POST_HARVEST";

// Template step (PublicStepDto from /crop-management/step/crop/:cropId)
export interface PublicStep {
  id: number;
  name: string;
  description: string;
  order: number;
  repeated: boolean;
  is_optional: boolean;
  min_logs: number;
  type: StepType;
}

// Legacy Step type (kept for backward compat)
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
}

// ── Verification Assignment (list item) ──────────────────────────────────────
// GET /crop-management/verification
export type VerificationStatus = "pending" | "voted";

export interface VerificationAssignment {
  id: number;
  auditor_profile_id: number;
  log_id: number;
  type: string;
  vote_transaction_hash: string | null;
  assigned_at: string;
  voted_at: string | null;
  deadline: string;
}

// ── Verification Package ──────────────────────────────────────────────────────
// GET /crop-management/verification/:id/package

export interface LogEntry {
  id: number;
  name: string;
  description: string;
  image_urls: string[];
  video_urls: string[];
  location: { lat: number; lng: number } | null;
  transaction_hash: string | null;
  notes: string | null;
  created: string;
  season_detail_id: number;
  farm_id: number;
  is_active: boolean;
  status: number;
  verified: boolean;
}

export interface FarmSummary {
  id: number;
  farm_id: string;
  farm_name: string;
  description: string;
  avatar_url: string | null;
  profile_image_urls: string[];
  email: string;
  phone: string;
  tax_number: string;
  status: string;
  establish: string | null;
  farm_size: number | null;
  user_id: number;
  created: string;
  updated: string;
  address_id: number;
  transparency_score: {
    total: number;
    transparency: number;
    market_validation: number;
    order_fulfillment: number | null;
  } | null;
}

export interface AiAnalysis {
  id: number;
  log_id: number;
  farm_id: number;
  overall_score: string;
  is_duplicate: boolean;
  duplicate_source_log_id: number | null;
  ai_analysis: {
    safe_search: { racy: string; adult: string; violence: string };
    web_detection: { is_stock_or_web_image: boolean };
    is_agricultural: boolean;
    label_annotations: unknown[];
    per_image_results: unknown[];
    manipulation_indicators: unknown[];
  };
  manipulation_score: string;
  relevance_score: string;
  processed: boolean;
  created: string;
}

export interface VerificationPackage {
  id: number;
  log: LogEntry;
  farm: FarmSummary;
  ai_analysis: AiAnalysis | null;
  hash: {
    on_chainHash: string | null;
    current_hash: string;
  };
  deadline: string;
}

// ── On-chain state ────────────────────────────────────────────────────────────
// GET /on-chain/auditor-registry/verification?id=<log_id>&identifier=log
export interface OnChainVote {
  isValid: boolean;
  auditor: string;
  timestamp: number;
}

// GET /on-chain/auditor-registry/verification/deadline?id=<log_id>&identifier=log
export interface OnChainDeadline {
  deadline: string;
}

// ── Legacy (kept for backward compat) ────────────────────────────────────────
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
  status: "PENDING" | "APPROVED" | "REJECTED";
  submitted_at: string;
  reviewed_at?: string;
  reason?: string;
}
