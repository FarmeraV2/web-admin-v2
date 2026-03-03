export type ChannelType = "EMAIL" | "SMS" | "PUSH";

export interface NotificationChannel {
  id: string;
  type: ChannelType;
  name: string;
  config: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel_type: ChannelType;
  subject?: string;
  body: string;
  created_at: string;
  updated_at: string;
}
