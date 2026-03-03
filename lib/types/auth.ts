export type UserRole = "ADMIN" | "AUDITOR" | "FARMER" | "BUYER";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export interface JWTPayload {
  id: number;
  uuid: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  status: string;
  iat: number;
  exp: number;
}

export interface SessionData {
  accessToken: string;
  role: UserRole;
  userId: string;
  email: string;
}
