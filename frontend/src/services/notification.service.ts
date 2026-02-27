/**
 * Notification Service for Calabash
 * DISABLED - WebSocket not implemented yet
 * 
 * To re-enable when backend is ready:
 * 1. Set ENABLED = true
 * 2. Implement WebSocket endpoint on backend
 * 3. Update WS_URL
 */

import type {
  Notification,
  NotificationStats,
  NotificationSubscription,
  RealTimeEvent,
  WebSocketMessage,
} from "@/types/notifications";
import { useUserStore } from "@/store/useUserStore";

const NOTIFICATION_STORAGE_KEY = "calabash-notifications";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://calabash-n9hz.onrender.com/ws";

// DISABLED - Set to true when backend WebSocket is ready
const ENABLED = false;

type NotificationListener = (notifications: Notification[]) => void;

export class NotificationService {
  private static instance: NotificationService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Set<NotificationListener> = new Set();
  private notifications: Notification[] = [];
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private isUsingPolling = false;

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // ============================================================================
  // Storage Management
  // ============================================================================

  private loadFromStorage(): void {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (stored) {
        this.notifications = JSON.parse(stored) as Notification[];
      }
    } catch {
      this.notifications = [];
    }
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(this.notifications));
    } catch {
      // Storage quota exceeded or private mode
    }
  }

  // ============================================================================
  // Listener Management
  // ============================================================================

  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener(this.notifications);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.notifications));
  }

  // ============================================================================
  // WebSocket Connection
  // ============================================================================

  connect(userId: string): void {
    // DISABLED - Don't connect until backend is ready
    if (!ENABLED) {
      console.log('[NotificationService] Disabled - WebSocket not implemented yet');
      return;
    }
    
    if (typeof window === "undefined") return;
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const token = useUserStore.getState().token;
    if (!token) return;

    try {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log("[NotificationService] WebSocket connected");
        this.reconnectAttempts = 0;
        this.stopPolling();

        // Subscribe to user's notification channel
        this.send({
          type: "subscribe",
          channel: `user:${userId}`,
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as RealTimeEvent;
          this.handleRealTimeEvent(message);
        } catch (error) {
          console.error("[NotificationService] Failed to parse message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("[NotificationService] WebSocket closed");
        this.attemptReconnect(userId);
      };

      this.ws.onerror = (error) => {
        console.error("[NotificationService] WebSocket error:", error);
        this.ws?.close();
      };
    } catch {
      // WebSocket not supported, fall back to polling
      this.startPolling(userId);
    }
  }

  private attemptReconnect(userId: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("[NotificationService] Max reconnect attempts reached, switching to polling");
      this.startPolling(userId);
      return;
    }

    this.reconnectAttempts += 1;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      this.connect(userId);
    }, delay);
  }

  private send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopPolling();
  }

  // ============================================================================
  // Polling Fallback
  // ============================================================================

  private startPolling(userId: string): void {
    if (this.isUsingPolling) return;
    this.isUsingPolling = true;

    const poll = async () => {
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll just check storage for updates
        this.loadFromStorage();
        this.notifyListeners();
      } catch (error) {
        console.error("[NotificationService] Polling error:", error);
      }
    };

    poll();
    this.pollInterval = setInterval(poll, 30000); // Poll every 30 seconds
    console.log("[NotificationService] Started polling");
  }

  private stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      this.isUsingPolling = false;
      console.log("[NotificationService] Stopped polling");
    }
  }

  // ============================================================================
  // Real-time Event Handling
  // ============================================================================

  private handleRealTimeEvent(event: RealTimeEvent): void {
    switch (event.event) {
      case "notification:new": {
        const notification = event.payload as Notification;
        this.addNotification(notification);
        break;
      }
      case "notification:read": {
        const notificationId = event.payload as string;
        this.markAsRead(notificationId);
        break;
      }
      case "notification:clear": {
        const payload = event.payload;
        const notificationIds: string[] = Array.isArray(payload)
          ? (payload as unknown as string[])
          : [payload as unknown as string];
        this.removeNotifications(notificationIds);
        break;
      }
    }
  }

  // ============================================================================
  // Notification Management
  // ============================================================================

  addNotification(notification: Notification): void {
    this.notifications.unshift(notification);
    this.saveToStorage();
    this.notifyListeners();

    // Show browser notification if enabled
    if (notification.priority === "high" || notification.priority === "urgent") {
      this.showBrowserNotification(notification);
    }
  }

  private showBrowserNotification(notification: Notification): void {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    new Notification(notification.title, {
      body: notification.message,
      icon: "/android-chrome-192x192.png",
      badge: "/android-chrome-192x192.png",
      tag: notification.id,
      requireInteraction: notification.priority === "urgent",
    });
  }

  markAsRead(notificationId: string): void {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => {
      n.read = true;
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  removeNotification(notificationId: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.saveToStorage();
    this.notifyListeners();
  }

  removeNotifications(ids: string[]): void {
    this.notifications = this.notifications.filter((n) => !ids.includes(n.id));
    this.saveToStorage();
    this.notifyListeners();
  }

  clearAll(): void {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  getStats(): NotificationStats {
    const stats: NotificationStats = {
      total: this.notifications.length,
      unread: this.getUnreadCount(),
      byType: {
        course_update: 0,
        new_material: 0,
        deadline_reminder: 0,
        achievement_unlocked: 0,
        streak_milestone: 0,
        announcement: 0,
        system: 0,
        qa_reply: 0,
        grade_published: 0,
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0,
      },
    };

    this.notifications.forEach((notification) => {
      stats.byType[notification.type] += 1;
      stats.byPriority[notification.priority] += 1;
    });

    return stats;
  }

  // ============================================================================
  // Subscription Management
  // ============================================================================

  async getSubscription(): Promise<NotificationSubscription | null> {
    // In a real implementation, this would fetch from the API
    return {
      userId: useUserStore.getState().user?.id || "",
      channels: ["in_app", "push"],
      types: [
        "course_update",
        "new_material",
        "deadline_reminder",
        "achievement_unlocked",
        "announcement",
      ],
      enabled: true,
    };
  }

  async updateSubscription(subscription: Partial<NotificationSubscription>): Promise<void> {
    // In a real implementation, this would update the API
    console.log("[NotificationService] Would update subscription:", subscription);
  }

  async requestPushPermission(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    if (!("Notification" in window)) return false;

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
}

export const notificationService = NotificationService.getInstance();
