import { api } from "@/lib/api";
import { Order, OrderStatus } from "@/lib/types/order";
import { PaginatedResponse } from "@/lib/types/api";

export interface ListOrdersParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  start_date?: string;
  end_date?: string;
}

export function listOrders(
  params: ListOrdersParams = {}
): Promise<PaginatedResponse<Order>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status) query.set("status", params.status);
  if (params.start_date) query.set("start_date", params.start_date);
  if (params.end_date) query.set("end_date", params.end_date);
  return api.get(`/admin/orders?${query}`);
}

export function getOrder(orderId: string): Promise<Order> {
  return api.get(`/order/${orderId}`);
}
