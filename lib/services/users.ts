import { api } from "@/lib/api";
import { User } from "@/lib/types/user";
import { UserRole, UserStatus } from "@/lib/types/auth";
import { PaginatedResponse } from "@/lib/types/api";

export interface ListUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export function listUsers(params: ListUsersParams = {}): Promise<PaginatedResponse<User>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  return api.get(`/admin/users?${query}`);
}

export function getUser(userId: string): Promise<User> {
  return api.get(`/user/${userId}`);
}

export function updateUserStatus(
  userId: string,
  status: UserStatus
): Promise<void> {
  return api.patch(`/admin/users/${userId}/status`, { status });
}
