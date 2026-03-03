import { api } from "@/lib/api";
import { VerificationRequest } from "@/lib/types/crop";

export function listPendingVerifications(): Promise<VerificationRequest[]> {
  return api.get("/crop-management/verification/pending");
}

export function getVerificationPackage(requestId: string): Promise<VerificationRequest> {
  return api.get(`/crop-management/verification/${requestId}/package`);
}

export function getOnChainVerificationState(requestId: string): Promise<unknown> {
  return api.get(`/on-chain/auditor-registry/verification?requestId=${requestId}`);
}

export function getVerificationDeadline(requestId: string): Promise<unknown> {
  return api.get(`/on-chain/auditor-registry/verification/deadline?requestId=${requestId}`);
}

export function submitVerificationVote(body: {
  requestId: string;
  vote: "APPROVED" | "REJECTED";
  reason?: string;
}): Promise<void> {
  return api.post("/crop-management/verification/vote", body);
}
