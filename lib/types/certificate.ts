import { Farm } from "./farm";

export type CertificateStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";
export type CertificateType =
  | "ORGANIC"
  | "ISO"
  | "GAP"
  | "GLOBAL_GAP"
  | "FSSC"
  | "RAINFOREST"
  | "OTHER";

export interface FarmCertificate {
  id: string;
  farm_id: string;
  farm?: Farm;
  type: CertificateType;
  issuer: string;
  valid_until: string;
  document_url: string;
  status: CertificateStatus;
  reason?: string;
  created_at: string;
  updated_at: string;
}
