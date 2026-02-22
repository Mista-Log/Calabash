"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SnackbarState {
  open: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface UseSnackbarReturn {
  snackbar: SnackbarState;
  showSnackbar: (message: string, actionLabel?: string, onAction?: () => void) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = React.createContext<UseSnackbarReturn | undefined>(undefined);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    actionLabel: undefined,
    onAction: undefined,
  });

  const autoCloseTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showSnackbar = React.useCallback(
    (message: string, actionLabel?: string, onAction?: () => void) => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }

      setSnackbar({
        open: true,
        message,
        actionLabel,
        onAction,
      });

      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 5000);

      autoCloseTimerRef.current = timer;
    },
    [],
  );

  const closeSnackbar = React.useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  React.useEffect(
    () => () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    },
    [],
  );

  const value = React.useMemo(
    () => ({
      snackbar,
      showSnackbar,
      closeSnackbar,
    }),
    [snackbar, showSnackbar, closeSnackbar]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <MdSnackbar
        open={snackbar.open}
        onClose={closeSnackbar}
        actionLabel={snackbar.actionLabel}
        onAction={snackbar.onAction}
      >
        {snackbar.message}
      </MdSnackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = React.useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}

export interface MdSnackbarProps {
  open: boolean;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Material 3 Snackbar Component
 */
export function MdSnackbar({
  open,
  onClose,
  actionLabel,
  onAction,
  children,
  className,
}: MdSnackbarProps) {
  const handleAction = () => {
    onAction?.();
    onClose();
  };

  if (!open) return null;

  const actionButtonEl = actionLabel
    ? React.createElement(
        "button",
        {
          onClick: handleAction,
          className:
            "m3-label-large text-[color:var(--md-sys-color-inverse-primary)] hover:opacity-80 transition-opacity",
        },
        actionLabel
      )
    : null;

  const closeButtonEl = React.createElement(
    "button",
    {
      onClick: onClose,
      className:
        "flex items-center justify-center w-8 h-8 rounded-full hover:bg-[color:var(--md-sys-color-inverse-on-surface)]/10 transition-colors",
      "aria-label": "Close",
    },
    <md-icon className="text-[18px]">close</md-icon>
  );

  return React.createElement(
    "div",
    {
      className: cn(
        "fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50",
        "bg-[color:var(--md-sys-color-inverse-surface)]",
        "text-[color:var(--md-sys-color-inverse-on-surface)]",
        "rounded-lg px-4 py-3",
        "shadow-lg",
        "flex items-center gap-4",
        "min-w-[280px] max-w-[560px]",
        "m3-body-medium",
        className
      ),
      role: "alert",
      "aria-live": "assertive",
    },
    React.createElement("span", { className: "flex-1" }, children),
    actionButtonEl,
    closeButtonEl
  );
}
