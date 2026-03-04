import { api } from "@/lib/api";
import { FarmListItem, AdminFarmDetail, FarmStatus } from "@/lib/types/farm";
import { FarmCertificate } from "@/lib/types/certificate";
import { BackendResponse, BackendPaginatedData } from "@/lib/types/api";

export type ApprovalAction = "APPROVED" | "REJECTED" | "BLOCKED";

export interface ListFarmsParams {
  page?: number;
  limit?: number;
  status?: FarmStatus;
  query?: string;
}

export function listFarms(
  params: ListFarmsParams = {}
): Promise<BackendResponse<BackendPaginatedData<FarmListItem>>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.status) q.set("status", params.status);
  if (params.query) q.set("query", params.query);
  return api.get(`/admin/farm-management?${q}`);
}

export function getFarmDetail(
  farmId: number | string
): Promise<BackendResponse<AdminFarmDetail>> {
  return api.get(`/admin/farm-management/${farmId}`);
}

export function getFarmCertificates(
  farmId: number | string
): Promise<BackendResponse<FarmCertificate[]>> {
  return api.get(`/admin/farm-management/${farmId}/certificate`);
}

export function approveFarm(body: {
  action: ApprovalAction;
  farm_id: number;
  reason?: string;
}): Promise<BackendResponse<boolean>> {
  return api.post("/admin/farm-management/approve", body);
}
