// Backend CertificateStatus enum
export type CertificateStatus = "PENDING" | "APPROVED" | "REJECTED";

// Backend CertificateType enum
export type CertificateType =
  | "BUSINESS_LICENSE"
  | "FOOD_SAFETY"
  | "VIETGAP"
  | "GLOBALGAP"
  | "ORGANIC"
  | "OTHER";

/** Farm certificate from GET /admin/farm-management/:id/certificate */
export interface FarmCertificate {
  id: number;
  type: CertificateType;
  url: string;
  meta_data: Record<string, unknown> | null;
  valid_until: string | null;
  issuer: string | null;
  status: CertificateStatus;
  is_deleted: boolean;
  created: string;
  farm_id: number;
}
