"use server";

import { revalidatePath } from "next/cache";
import { submitVote } from "@/lib/services/verification";

export async function submitVoteAction(
  requestId: number,
  transactionHash: string
): Promise<{ error?: string }> {
  try {
    await submitVote(requestId, transactionHash);
    revalidatePath(`/verification/${requestId}`);
    revalidatePath("/verification");
    return {};
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to submit vote.";
    return { error: message };
  }
}
