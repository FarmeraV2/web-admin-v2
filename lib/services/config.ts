import { api } from "@/lib/api";
import { Category, Subcategory } from "@/lib/types/product";
import { Step, StepType } from "@/lib/types/crop";
import { BackendResponse, BackendPaginatedData } from "@/lib/types/api";

// ─── Categories ──────────────────────────────────────────────────────────────

export interface ListCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function listCategories(
  params: ListCategoriesParams = {}
): Promise<BackendResponse<BackendPaginatedData<Category>>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  return api.get(`/category?${query}`);
}

export function getCategoryWithSubs(
  categoryId: number
): Promise<BackendResponse<Category>> {
  return api.get(`/category/${categoryId}?include_subcategory=true`);
}

export function createCategory(body: {
  name: string;
  description?: string;
}): Promise<BackendResponse<Category>> {
  return api.post("/category", body);
}

export function createSubcategory(body: {
  name: string;
  description?: string;
  category_id: number;
}): Promise<BackendResponse<Subcategory>> {
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
