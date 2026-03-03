import { api } from "@/lib/api";
import { Category, Subcategory } from "@/lib/types/product";
import { Step, StepType } from "@/lib/types/crop";

// ─── Categories ──────────────────────────────────────────────────────────────

export function listCategories(): Promise<Category[]> {
  return api.get("/category");
}

export function createCategory(body: { name: string }): Promise<Category> {
  return api.post("/category", body);
}

export function createSubcategory(body: {
  name: string;
  category_id: string;
}): Promise<Subcategory> {
  return api.post("/category/subcategory", body);
}

// ─── Crop Steps ───────────────────────────────────────────────────────────────

export function listSteps(): Promise<Step[]> {
  return api.get("/step");
}

export function getStep(id: string): Promise<Step> {
  return api.get(`/step/${id}`);
}

export function createStep(body: {
  name: string;
  type: StepType;
  description?: string;
  order: number;
  min_logs: number;
  is_optional?: boolean;
  intervals?: number;
}): Promise<Step> {
  return api.post("/step", body);
}
