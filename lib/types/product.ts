import { Farm } from "./farm";

export type ProductStatus = "NOT_YET_OPEN" | "OPEN" | "CLOSED" | "OUT_OF_STOCK";

export interface Category {
  category_id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  created: string;
  updated: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  subcategory_id: number;
  name: string;
  description?: string | null;
  created: string;
  updated: string;
  category?: Pick<Category, "category_id" | "name">;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  unit: string;
  weight?: number;
  status: ProductStatus;
  images: string[];
  farm: Farm;
  subcategories: Subcategory[];
  created_at: string;
  updated_at: string;
}
