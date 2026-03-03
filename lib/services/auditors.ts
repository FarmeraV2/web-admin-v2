import { api } from "@/lib/api";

export function registerAuditor(body: {
  user_id: string;
  wallet_address: string;
}): Promise<void> {
  return api.post("/crop-management/auditor-profile/register", body);
}

export function getAuditorOnChainInfo(walletAddress: string): Promise<unknown> {
  return api.get(`/on-chain/auditor-registry/auditor?address=${walletAddress}`);
}

export function getAuditorCount(): Promise<{ count: number }> {
  return api.get("/on-chain/auditor-registry/auditor-number");
}
