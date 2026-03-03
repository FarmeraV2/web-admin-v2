import { api } from "@/lib/api";
import { FarmCertificate, CertificateStatus, CertificateType } from "@/lib/types/certificate";
import { PaginatedResponse } from "@/lib/types/api";

export interface ListCertificatesParams {
  page?: number;
  limit?: number;
  status?: CertificateStatus;
  type?: CertificateType;
}

export function listCertificates(
  params: ListCertificatesParams = {}
): Promise<PaginatedResponse<FarmCertificate>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.type) query.set("type", params.type);
  return api.get(`/admin/certificates?${query}`);
}

export function listCertificatesByFarm(farmId: string): Promise<FarmCertificate[]> {
  return api.get(`/certificate/farm/${farmId}`);
}

export function updateCertificateStatus(
  id: string,
  body: { status: "VERIFIED" | "REJECTED"; reason?: string }
): Promise<void> {
  return api.patch(`/admin/certificates/${id}/status`, body);
}
