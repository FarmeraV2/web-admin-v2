"use server";

import { revalidatePath } from "next/cache";
import { approveFarm } from "@/lib/services/farms";

export async function approveFarmAction(
  farmId: string,
  status: "APPROVED" | "REJECTED",
  reason?: string
): Promise<{ error?: string }> {
  try {
    await approveFarm({ farm_id: farmId, status, reason });
    revalidatePath(`/farms/${farmId}`);
    revalidatePath("/farms");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update farm status.";
    return { error: message };
  }
}
