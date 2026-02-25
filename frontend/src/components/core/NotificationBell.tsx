"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { MaterialSymbol } from "@/components/core/MaterialSymbol";
import { MdIconButton } from "@/components/core/md-button";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useUserStore } from "@/store/useUserStore";
import type { Notification } from "@/types/notifications";
import Link from "next/link";

const NOTIFICATION_ICON_MAP: Record<Notification["type"], string> = {
  course_update: "update",
  new_material: "upload_file",
  deadline_reminder: "event_busy",
  achievement_unlocked: "emoji_events",
  streak_milestone: "local_fire_department",
  announcement: "campaign",
  system: "settings",
  qa_reply: "chat",
  grade_published: "grading",
};

const NOTIFICATION_PRIORITY_STYLES: Record<Notification["priority"], string> = {
  low: "border-l-2 border-l-[color:var(--md-sys-color-outline)]",
  medium: "border-l-2 border-l-[color:var(--md-sys-color-primary)]",
  high: "border-l-2 border-l-[color:var(--md-sys-color-error)]",
  urgent: "border-l-4 border-l-[color:var(--md-sys-color-error)] bg-[color:var(--md-sys-color-error-container)]/10",
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClose: () => void;
  index?: number;
}

function NotificationItem({ notification, onMarkAsRead, onClose, index = 0 }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onClose();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full text-left",
        "relative flex gap-3 p-4 transition-all m3-motion-short",
        "hover:bg-[color:var(--md-sys-color-surface-container-highest)]",
        !notification.read && "bg-[color:var(--md-sys-color-primary-container)]/8",
        "border-b border-[color:var(--md-sys-color-outline-variant)]/50",
        "last:border-b-0",
        NOTIFICATION_PRIORITY_STYLES[notification.priority],
      )}
      style={{
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Unread indicator dot */}
      {!notification.read && (
        <span className="absolute -left-0.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[color:var(--md-sys-color-primary)]" />
      )}
      
      {/* Icon */}
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          "transition-colors m3-motion-short",
          notification.read
            ? "bg-[color:var(--md-sys-color-surface-container-high)]"
            : "bg-[color:var(--md-sys-color-primary-container)]",
        )}
      >
        <MaterialSymbol
          icon={NOTIFICATION_ICON_MAP[notification.type]}
          size={22}
          className={cn(
            "transition-colors m3-motion-short",
            notification.read
              ? "text-[color:var(--md-sys-color-on-surface-variant)]"
              : "text-[color:var(--md-sys-color-on-primary-container)]",
          )}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "m3-body-medium line-clamp-1",
              notification.read
                ? "text-[color:var(--md-sys-color-on-surface-variant)]"
                : "font-semibold text-[color:var(--md-sys-color-on-surface)]",
            )}
          >
            {notification.title}
          </p>
        </div>
        <p className="mt-0.5 m3-body-small text-[color:var(--md-sys-color-on-surface-variant)] line-clamp-2">
          {notification.message}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]/60">
            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
          </span>
          {notification.priority === "urgent" && (
            <span className="flex items-center gap-1 rounded-full bg-[color:var(--md-sys-color-error-container)] px-2 py-0.5">
              <span className="m3-label-small font-semibold text-[color:var(--md-sys-color-on-error-container)]">
                Urgent
              </span>
            </span>
          )}
          {notification.priority === "high" && (
            <span className="flex items-center gap-1 rounded-full bg-[color:var(--md-sys-color-error-container)]/50 px-2 py-0.5">
              <span className="m3-label-small font-semibold text-[color:var(--md-sys-color-on-error-container)]">
                High
              </span>
            </span>
          )}
        </div>

        {/* Action Link */}
        {notification.actionUrl && (
          <div className="mt-2.5">
            <span className="inline-flex items-center gap-1 m3-label-large text-[color:var(--md-sys-color-primary)]">
              {notification.actionLabel || "View details"}
              <MaterialSymbol icon="arrow_forward" size={16} />
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

interface NotificationBellProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function NotificationBell({ isOpen, onClose, onToggle }: NotificationBellProps) {
  const { user } = useUserStore();
  const {
    notifications,
    stats,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotificationStore();

  const bellRef = React.useRef<HTMLDivElement>(null);
  const unreadCount = stats.unread;

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        bellRef.current &&
        !bellRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Initialize notifications when user is available
  React.useEffect(() => {
    if (user?.id) {
      useNotificationStore.getState().initialize(user.id);
    }
  }, [user?.id]);

  const hasNotifications = notifications.length > 0;
  const displayedNotifications = hasNotifications ? notifications.slice(0, 20) : [];

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell Button */}
      <MdIconButton
        icon="notifications"
        aria-label="Notifications"
        title="Notifications"
        onClick={onToggle}
        className="relative"
      >
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1",
              "bg-[color:var(--md-sys-color-error)] text-[color:var(--md-sys-color-on-error)]",
              "m3-label-small font-bold",
              "shadow-md",
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </MdIconButton>

      {/* Notification Panel */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-1rem)]",
            "bg-[color:var(--md-sys-color-surface-container)]",
            "rounded-3xl",
            "border border-[color:var(--md-sys-color-outline-variant)]",
            "shadow-2xl",
            "overflow-hidden",
            "z-50",
            "m3-motion-short",
          )}
          style={{
            animation: "slideDown 0.2s ease-out",
          }}
        >
          {/* Header */}
          <div className="relative overflow-hidden">
            {/* Background gradient */}
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background: "linear-gradient(135deg, var(--md-sys-color-primary-container) 0%, var(--md-sys-color-surface-container) 100%)",
              }}
            />
            
            <div className="relative flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--md-sys-color-primary)" }}
                >
                  <MaterialSymbol
                    icon="notifications"
                    size={22}
                    className="text-[color:var(--md-sys-color-on-primary)]"
                  />
                </div>
                <div>
                  <h2 className="m3-title-medium text-[color:var(--md-sys-color-on-surface)]">
                    Notifications
                  </h2>
                  <p className="m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]">
                    {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                  </p>
                </div>
              </div>
              
              {hasNotifications && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                      "m3-label-large text-[color:var(--md-sys-color-primary)]",
                      "hover:bg-[color:var(--md-sys-color-primary-container)]/15",
                      "transition-colors m3-motion-short",
                    )}
                    title="Mark all as read"
                  >
                    <MaterialSymbol icon="done_all" size={18} />
                    Mark read
                  </button>
                  <div
                    className="h-5 w-px"
                    style={{ backgroundColor: "var(--md-sys-color-outline-variant)" }}
                  />
                  <button
                    type="button"
                    onClick={clearAll}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                      "m3-label-large text-[color:var(--md-sys-color-on-surface-variant)]",
                      "hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                      "transition-colors m3-motion-short",
                    )}
                    title="Clear all"
                  >
                    <MaterialSymbol icon="delete_outline" size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notification List - Hidden Scrollbar */}
          <div
            className={cn(
              "max-h-[56vh] overflow-y-auto",
              "scrollbar-none scrollbar-width-none scrollbar-thumb-transparent",
              "-mx-1 px-1",
            )}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Hide scrollbar for Chrome, Safari and Opera */}
            <style jsx>{`
              .scrollbar-none::-webkit-scrollbar {
                display: none;
                width: 0;
                height: 0;
              }
            `}</style>
            
            {hasNotifications ? (
              <div className="space-y-1 pb-2">
                {displayedNotifications.map((notification, index) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onClose={onClose}
                    index={index}
                  />
                ))}
                {notifications.length > 20 && (
                  <div className="py-3 text-center">
                    <p className="m3-label-small text-[color:var(--md-sys-color-on-surface-variant)]">
                      Showing 20 of {notifications.length} notifications
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl"
                  style={{ backgroundColor: "var(--md-sys-color-primary-container)" }}
                >
                  <MaterialSymbol
                    icon="notifications_none"
                    size={36}
                    className="text-[color:var(--md-sys-color-on-primary-container)]"
                  />
                </div>
                <h3 className="m3-title-small text-[color:var(--md-sys-color-on-surface)]">
                  No notifications yet
                </h3>
                <p className="mt-2 m3-body-small text-center text-[color:var(--md-sys-color-on-surface-variant)]">
                  When you receive notifications, they&apos;ll appear here in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
