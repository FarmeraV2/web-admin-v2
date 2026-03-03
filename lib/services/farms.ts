import { api } from "@/lib/api";
import { Farm, FarmStatus, FarmApprovalRecord } from "@/lib/types/farm";
import { PaginatedResponse } from "@/lib/types/api";

export interface ListFarmsParams {
  page?: number;
  limit?: number;
  status?: FarmStatus;
  search?: string;
}

export function listFarms(params: ListFarmsParams = {}): Promise<PaginatedResponse<Farm>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  return api.get(`/farm?${query}`);
}

export function getFarm(farmId: string): Promise<Farm> {
  return api.get(`/farm/${farmId}`);
}

export function getFarmApprovalHistory(farmId: string): Promise<FarmApprovalRecord[]> {
  return api.get(`/farm-approval/${farmId}`);
}

export function approveFarm(body: {
  farm_id: string;
  status: "APPROVED" | "REJECTED";
  reason?: string;
}): Promise<void> {
  return api.post("/admin/farm-management/approve", body);
}
