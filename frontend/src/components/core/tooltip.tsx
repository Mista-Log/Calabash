<<<<<<< HEAD
"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  children?: React.ReactNode;
}

type Side = "top" | "bottom" | "left" | "right";

const TooltipContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delayDuration: number;
  triggerRef: React.RefObject<HTMLElement | null>;
} | null>(null);

function useTooltip() {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("Tooltip components must be used within a Tooltip");
  }
  return context;
}

const TooltipProvider = ({
  children,
  delayDuration: _delayDuration,
}: {
  children?: React.ReactNode;
  delayDuration?: number;
}) => <>{children}</>;

const Tooltip = ({
  open: controlledOpen,
  onOpenChange,
  delayDuration = 200,
  children,
}: TooltipProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <TooltipContext.Provider
      value={{ open, onOpenChange: setOpen, delayDuration, triggerRef }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
  const { onOpenChange, delayDuration, triggerRef } = useTooltip();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const setRefs = React.useCallback(
    (node: HTMLElement | null) => {
      triggerRef.current = node;
      if (!ref) {
        return;
      }
      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    },
    [ref, triggerRef],
  );

  const handleOpen = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => onOpenChange(true), delayDuration);
  }, [delayDuration, onOpenChange]);

  const handleClose = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onOpenChange(false);
  }, [onOpenChange]);

  React.useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return (
    <span
      ref={setRefs}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        handleOpen();
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        handleClose();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        handleOpen();
      }}
      onBlur={(event) => {
        onBlur?.(event);
        handleClose();
      }}
      {...props}
    >
      {children}
    </span>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    sideOffset?: number;
    side?: Side;
  }
>(({ className, sideOffset = 4, side = "bottom", style, ...props }, ref) => {
  const { open, triggerRef } = useTooltip();
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      return;
    }

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      if (side === "top") {
        setPosition({
          left: rect.left + rect.width / 2,
          top: rect.top - sideOffset,
          transform: "translate(-50%, -100%)",
        });
        return;
      }

      if (side === "bottom") {
        setPosition({
          left: rect.left + rect.width / 2,
          top: rect.bottom + sideOffset,
          transform: "translateX(-50%)",
        });
        return;
      }

      if (side === "left") {
        setPosition({
          left: rect.left - sideOffset,
          top: rect.top + rect.height / 2,
          transform: "translate(-100%, -50%)",
        });
        return;
      }

      setPosition({
        left: rect.right + sideOffset,
        top: rect.top + rect.height / 2,
        transform: "translateY(-50%)",
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, side, sideOffset, triggerRef]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      ref={ref}
      className={cn(
        "z-50 overflow-hidden rounded-lg bg-inverse-surface px-3 py-1.5 text-[13px] font-medium text-inverse-on-surface shadow-none animate-in fade-in-0 zoom-in-95",
        className,
      )}
      style={{ position: "fixed", ...position, ...style }}
      role="tooltip"
      {...props}
    />,
    document.body,
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
=======
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
>>>>>>> origin/main
