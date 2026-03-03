import { api } from "@/lib/api";
import { NotificationChannel, NotificationTemplate, ChannelType } from "@/lib/types/notification";

// ─── Channels ─────────────────────────────────────────────────────────────────

export function listChannels(): Promise<NotificationChannel[]> {
  return api.get("/channel");
}

export function createChannel(body: {
  type: ChannelType;
  name: string;
  config: Record<string, string>;
}): Promise<NotificationChannel> {
  return api.post("/channel", body);
}

export function updateChannel(body: Partial<NotificationChannel>): Promise<NotificationChannel> {
  return api.put("/channel", body);
}

export function deleteChannel(id: string): Promise<void> {
  return api.delete(`/channel/${id}`);
}

// ─── Templates ────────────────────────────────────────────────────────────────

export function listTemplates(): Promise<NotificationTemplate[]> {
  return api.get("/template");
}

export function createTemplate(body: {
  name: string;
  channel_type: ChannelType;
  subject?: string;
  body: string;
}): Promise<NotificationTemplate> {
  return api.post("/template", body);
}

export function updateTemplate(
  id: string,
  body: Partial<NotificationTemplate>
): Promise<NotificationTemplate> {
  return api.patch(`/template/${id}`, body);
}

export function deleteTemplate(id: string): Promise<void> {
  return api.delete(`/template/${id}`);
}
