import { UserRole, UserStatus } from "./auth";

/** Returned by GET /admin/user-management (list) */
export interface PublicUser {
  id: number;
  uuid: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: "MALE" | "FEMALE" | "UNSPECIFIED";
  avatar: string | null;
  role: UserRole;
}

/** Returned by GET /admin/user-management/detail/:id */
export interface User extends PublicUser {
  phone: string | null;
  birthday: string | null;
  points: number;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  addresses?: DeliveryAddress[];
}

export interface DeliveryAddress {
  address_id: number;
  name: string;
  phone: string;
  street: string;
  postal_code: string | null;
  type: string | null;
  is_primary: boolean;
  created_at: string;
  province: { code: number; name: string; phone_code: number } | null;
  ward: { code: number; name: string; province_code: number } | null;
  old_province: { code: number; name: string; ghn_code: string | null } | null;
  old_district: { code: number; name: string; ghn_code: string | null } | null;
  old_ward: { code: number; name: string; ghn_code: string | null } | null;
}
