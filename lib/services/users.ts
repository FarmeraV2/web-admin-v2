import { api } from "@/lib/api";
import { PublicUser, User } from "@/lib/types/user";
import { UserRole, UserStatus } from "@/lib/types/auth";
import { BackendResponse, BackendPaginatedData } from "@/lib/types/api";

export interface ListUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export function listUsers(
  params: ListUsersParams = {}
): Promise<BackendResponse<BackendPaginatedData<PublicUser>>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  return api.get(`/admin/user-management?${query}`);
}

export function getUserDetail(userId: number): Promise<BackendResponse<User>> {
  return api.get(`/admin/user-management/detail/${userId}?include_addresses=false`);
}

export function updateUserStatus(
  userId: number,
  status: UserStatus
): Promise<BackendResponse<boolean>> {
  return api.patch(`/admin/user-management/status`, { user_id: userId, status });
}

export function updateUserRole(
  userId: number,
  role: UserRole
): Promise<BackendResponse<boolean>> {
  return api.patch(`/admin/user-management/role`, { user_id: userId, role });
}
