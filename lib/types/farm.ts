// Backend FarmStatus enum
export type FarmStatus =
  | "UNSPECIFIED"
  | "PENDING"
  | "VERIFIED"
  | "PENDING_APPROVE"
  | "APPROVED"
  | "BLOCKED"
  | "REJECTED";

/** From FarmListResponseDto — used in admin farm list */
export interface FarmListItem {
  id: number;
  farm_id: string;
  farm_name: string;
  description: string;
  avatar_url: string | null;
  status: FarmStatus;
  created: string;
}

export interface FarmOwner {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  avatar: string | null;
  role: string;
}

export interface FarmProvince {
  code: number;
  name: string;
  phone_code: number;
}

export interface FarmWard {
  code: number;
  name: string;
  province_code: number;
}

export interface FarmAddress {
  address_id: number;
  name: string;
  phone: string;
  street: string;
  postal_code: string;
  type: string | null;
  is_primary: boolean;
  province: FarmProvince | null;
  ward: FarmWard | null;
}

export interface TransparencyScore {
  transparency: number;
  total: number;
}

/** From AdminFarmDetailDto — used in admin farm detail */
export interface AdminFarmDetail {
  id: number;
  farm_id: string;
  farm_name: string;
  description: string;
  avatar_url: string | null;
  profile_image_urls: string[];
  email: string;
  phone: string;
  tax_number: string | null;
  status: FarmStatus;
  farm_size: number | null;
  establish: number | null;
  created: string;
  updated: string;
  owner: FarmOwner;
  transparency_score: TransparencyScore | null;
  address: FarmAddress | null;
}

// Legacy types
export interface Farm {
  id: string;
  name: string;
  description?: string;
  address: string;
  tax_number?: string;
  size?: number;
  established_year?: number;
  status: FarmStatus;
  owner: FarmOwner;
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
