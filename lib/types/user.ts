import { UserRole, UserStatus } from "./auth";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}
