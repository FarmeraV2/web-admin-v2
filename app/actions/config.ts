"use server";

import { revalidatePath } from "next/cache";
import { createCategory, createSubcategory, createStep } from "@/lib/services/config";
import { StepType } from "@/lib/types/crop";

export async function createCategoryAction(
  name: string
): Promise<{ error?: string }> {
  try {
    await createCategory({ name });
    revalidatePath("/config/categories");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category.";
    return { error: message };
  }
}

export async function createSubcategoryAction(
  name: string,
  categoryId: string
): Promise<{ error?: string }> {
  try {
    await createSubcategory({ name, category_id: categoryId });
    revalidatePath("/config/categories");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create subcategory.";
    return { error: message };
  }
}

export async function createStepAction(body: {
  name: string;
  type: StepType;
  description?: string;
  order: number;
  min_logs: number;
  is_optional?: boolean;
  intervals?: number;
}): Promise<{ error?: string }> {
  try {
    await createStep(body);
    revalidatePath("/config/steps");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create step.";
    return { error: message };
  }
}
