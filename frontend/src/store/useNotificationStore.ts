import { create } from "zustand";
import type { Notification, NotificationStats } from "@/types/notifications";
import { notificationService } from "@/services/notification.service";

interface NotificationStoreState {
  // State
  notifications: Notification[];
  stats: NotificationStats;
  isConnected: boolean;
  isUsingPolling: boolean;
  isLoading: boolean;

  // Actions
  initialize: (userId: string) => void;
  disconnect: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAll: () => void;
  refreshStats: () => void;
}

export const useNotificationStore = create<NotificationStoreState>((set, get) => ({
  notifications: [],
  stats: {
    total: 0,
    unread: 0,
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
  },
  isConnected: false,
  isUsingPolling: false,
  isLoading: true,

  initialize: (userId: string) => {
    if (!userId) return;

    set({ isLoading: true });

    // Load initial notifications from storage
    const initialNotifications = notificationService.getNotifications();
    const initialStats = notificationService.getStats();

    set({
      notifications: initialNotifications,
      stats: initialStats,
      isLoading: false,
    });

    // Subscribe to real-time updates
    notificationService.connect(userId);

    const unsubscribe = notificationService.subscribe((notifications) => {
      const stats = notificationService.getStats();
      set({
        notifications,
        stats,
        isConnected: true,
      });
    });

    // Store unsubscribe function for cleanup
    return unsubscribe;
  },

  disconnect: () => {
    notificationService.disconnect();
    set({ isConnected: false });
  },

  markAsRead: (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    const notifications = notificationService.getNotifications();
    const stats = notificationService.getStats();
    set({ notifications, stats });
  },

  markAllAsRead: () => {
    notificationService.markAllAsRead();
    const notifications = notificationService.getNotifications();
    const stats = notificationService.getStats();
    set({ notifications, stats });
  },

  removeNotification: (notificationId: string) => {
    notificationService.removeNotification(notificationId);
    const notifications = notificationService.getNotifications();
    const stats = notificationService.getStats();
    set({ notifications, stats });
  },

  clearAll: () => {
    notificationService.clearAll();
    set({
      notifications: [],
      stats: notificationService.getStats(),
    });
  },

  refreshStats: () => {
    set({ stats: notificationService.getStats() });
  },
}));
