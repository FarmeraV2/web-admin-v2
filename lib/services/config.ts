import { api } from "@/lib/api";
import { Category, Subcategory } from "@/lib/types/product";
import { Crop, CropType, PublicStep, StepType } from "@/lib/types/crop";
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

// ─── Crops ────────────────────────────────────────────────────────────────────

export interface ListCropsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function listCrops(
  params: ListCropsParams = {}
): Promise<BackendResponse<BackendPaginatedData<Crop>>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  return api.get(`/crop-management/crop?${query}`);
}

export function createCrop(body: {
  name: string;
  crop_type: CropType;
  description: string;
  image_urls?: string[];
}): Promise<BackendResponse<Crop>> {
  return api.post("/crop-management/crop", body);
}

// ─── Crop Steps ───────────────────────────────────────────────────────────────

export function listCropSteps(
  cropId: number
): Promise<BackendResponse<BackendPaginatedData<PublicStep>>> {
  return api.get(`/crop-management/step/crop/${cropId}`);
}

export function createStep(body: {
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
}): Promise<BackendResponse<PublicStep>> {
  return api.post("/crop-management", body);
}
