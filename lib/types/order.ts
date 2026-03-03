import { User } from "./user";
import { Farm } from "./farm";

export type OrderStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  id: string;
  buyer: User;
  farm: Farm;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  delivery_address: string;
  created_at: string;
  updated_at: string;
}
