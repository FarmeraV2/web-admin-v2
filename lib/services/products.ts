import { api } from "@/lib/api";
import { Product, ProductStatus } from "@/lib/types/product";
import { PaginatedResponse } from "@/lib/types/api";

export interface ListProductsParams {
  page?: number;
  limit?: number;
  status?: ProductStatus;
  search?: string;
  subcategory_ids?: string[];
}

export function listProducts(
  params: ListProductsParams = {}
): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.subcategory_ids?.length) {
    params.subcategory_ids.forEach((id) => query.append("subcategory_ids", id));
  }
  return api.get(`/product?${query}`);
}

export function getProduct(productId: string): Promise<Product> {
  return api.get(`/product/${productId}`);
}
