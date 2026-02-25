/**
 * Real-time Notification System Types for Calabash
 */

export type NotificationType =
  | "course_update"
  | "new_material"
  | "deadline_reminder"
  | "achievement_unlocked"
  | "streak_milestone"
  | "announcement"
  | "system"
  | "qa_reply"
  | "grade_published";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export type NotificationChannel = "in_app" | "push" | "email" | "all";

export interface NotificationData {
  courseId?: string;
  courseCode?: string;
  materialId?: string;
  achievementId?: string;
  deadlineId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  channels: NotificationChannel[];
  data?: NotificationData;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
}

export interface NotificationSubscription {
  userId: string;
  channels: NotificationChannel[];
  types: NotificationType[];
  enabled: boolean;
  quietHours?: {
    start: string; // HH:mm format
    end: string; // HH:mm format
    enabled: boolean;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

export interface RealTimeEvent {
  event: "notification:new" | "notification:read" | "notification:clear";
  payload: Notification | Notification[] | string;
  timestamp: string;
}

export interface WebSocketMessage {
  type: "subscribe" | "unsubscribe" | "notification" | "heartbeat";
  channel?: string;
  data?: unknown;
}
