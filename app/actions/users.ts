"use server";

import { revalidatePath } from "next/cache";
import { updateUserStatus } from "@/lib/services/users";
import { UserStatus } from "@/lib/types/user";

export async function updateUserStatusAction(
  userId: string,
  status: UserStatus
): Promise<{ error?: string }> {
  try {
    await updateUserStatus(userId, status);
    revalidatePath(`/users/${userId}`);
    revalidatePath("/users");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update user status.";
    return { error: message };
  }
}
