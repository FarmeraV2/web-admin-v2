import { api } from "@/lib/api";
import {
  VerificationAssignment,
  VerificationPackage,
  OnChainVote,
  OnChainDeadline,
} from "@/lib/types/crop";
import {
  BackendResponse,
  BackendPaginatedData,
} from "@/lib/types/api";

export type VerificationStatusFilter = "pending" | "voted";

export interface ListVerificationsParams {
  page?: number;
  limit?: number;
  status?: VerificationStatusFilter;
}

export function listVerifications(
  params: ListVerificationsParams = {}
): Promise<BackendResponse<BackendPaginatedData<VerificationAssignment>>> {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.status) q.set("status", params.status);
  return api.get(`/crop-management/verification?${q}`);
}

export function getVerificationPackage(
  requestId: number | string
): Promise<BackendResponse<VerificationPackage>> {
  return api.get(`/crop-management/verification/${requestId}/package`);
}

/** Record that the auditor voted on-chain by submitting the transaction hash. */
export function submitVote(
  requestId: number | string,
  transaction_hash: string
): Promise<BackendResponse<boolean>> {
  return api.patch(`/crop-management/verification/${requestId}`, { transaction_hash });
}

// /** On-chain votes for a log (id = log.id, identifier = "log") */
// export function getOnChainVotes(
//   logId: number | string
// ): Promise<BackendResponse<OnChainVote[]>> {
//   return api.get(`/on-chain/auditor-registry/verification?id=${logId}&identifier=log`);
// }

/** On-chain deadline for a log */
export function getOnChainDeadline(
  logId: number | string
): Promise<BackendResponse<OnChainDeadline>> {
  return api.get(`/on-chain/auditor-registry/verification/deadline?id=${logId}&identifier=log`);
}
