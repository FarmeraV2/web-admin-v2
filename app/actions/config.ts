"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  createSubcategory,
  createCrop,
  createStep,
  listCropSteps,
} from "@/lib/services/config";
import { CropType, PublicStep, StepType } from "@/lib/types/crop";

export async function createCategoryAction(
  name: string,
  description?: string
): Promise<{ error?: string }> {
  try {
    await createCategory({ name, description });
    revalidatePath("/config/categories");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create category.";
    return { error: message };
  }
}

export async function createSubcategoryAction(
  name: string,
  categoryId: number,
  description?: string
): Promise<{ error?: string }> {
  try {
    await createSubcategory({ name, category_id: categoryId, description });
    revalidatePath("/config/categories");
    return {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create subcategory.";
    return { error: message };
  }
}

export async function createCropAction(body: {
  name: string;
  crop_type: CropType;
  description: string;
}): Promise<{ error?: string }> {
  try {
    await createCrop(body);
    revalidatePath("/config/steps");
    return {};
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create crop.";
    return { error: message };
  }
}

export async function createStepAction(body: {
  crop_id: number;
  name: string;
  description: string;
  notes?: string;
  order: number;
  repeated?: boolean;
  is_optional: boolean;
  min_logs: number;
  type: StepType;
  min_day_duration?: number;
  max_day_duration?: number;
}): Promise<{ error?: string }> {
  try {
    await createStep(body);
    revalidatePath("/config/steps");
    return {};
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create step.";
    return { error: message };
  }
}

export async function loadCropStepsAction(
  cropId: number
): Promise<{ steps?: PublicStep[]; error?: string }> {
  try {
    const res = await listCropSteps(cropId);
    return { steps: res.data.data };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to load steps.";
    return { error: message };
  }
}
