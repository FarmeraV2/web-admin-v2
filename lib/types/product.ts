import { Farm } from "./farm";

export type ProductStatus = "NOT_YET_OPEN" | "OPEN" | "CLOSED" | "OUT_OF_STOCK";

export interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
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
