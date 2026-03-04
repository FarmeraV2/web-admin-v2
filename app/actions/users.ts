"use server";

import { revalidatePath } from "next/cache";
import { updateUserStatus, updateUserRole } from "@/lib/services/users";
import { UserStatus, UserRole } from "@/lib/types/auth";

export async function updateUserStatusAction(
  userId: number,
  status: UserStatus
): Promise<{ error?: string }> {
  try {
    await updateUserStatus(userId, status);
    revalidatePath(`/users/${userId}`);
    revalidatePath("/users");
    return {};
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update user status.";
    return { error: message };
  }
}

export async function updateUserRoleAction(
  userId: number,
  role: UserRole
): Promise<{ error?: string }> {
  try {
    await updateUserRole(userId, role);
    revalidatePath(`/users/${userId}`);
    revalidatePath("/users");
    return {};
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update user role.";
    return { error: message };
  }
}
