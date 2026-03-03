"use server";

import { revalidatePath } from "next/cache";
import { updateCertificateStatus } from "@/lib/services/certificates";

export async function updateCertificateAction(
  id: string,
  status: "VERIFIED" | "REJECTED",
  reason?: string
): Promise<{ error?: string }> {
  try {
    await updateCertificateStatus(id, { status, reason });
    revalidatePath("/certificates");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update certificate.";
    return { error: message };
  }
}
