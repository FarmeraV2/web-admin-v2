"use server";

import { revalidatePath } from "next/cache";
import { submitVerificationVote } from "@/lib/services/verification";

export async function submitVerificationAction(
  requestId: string,
  vote: "APPROVED" | "REJECTED",
  reason?: string
): Promise<{ error?: string }> {
  try {
    await submitVerificationVote({ requestId, vote, reason });
    revalidatePath(`/verification/${requestId}`);
    revalidatePath("/verification");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit verification vote.";
    return { error: message };
  }
}
